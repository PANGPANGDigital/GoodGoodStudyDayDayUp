/*
 * AI Region Panel for Surge
 *
 * For each service, the script first requests that service's own domain.
 * It reads the matched Surge policy from the internal recent-request API,
 * then queries Cloudflare trace through that exact policy. This prevents one
 * service's proxy location from being reused for another service.
 */

var TRACE_URL = "https://www.cloudflare.com/cdn-cgi/trace";
var MARKER_PREFIX = "ai-unlock-panel-" + Date.now() + "-";

var CHATGPT = setOf("AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CO KM CG CD CR HR CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PA PG PY PE PH PL PT QA RO RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB ZA KR ES LK SR SD CH TW TJ TZ TH TL TG TO TT TN TR TM TV UG AE GB US UY UZ VU VA VE VN YE ZM ZW");
var CLAUDE = setOf("AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA TD CL CO KM CG CD CR HR CY CZ DK DJ DM DO EC EG SV GQ EE SZ FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ NA NR NP NL NZ NE NG MK NO OM PK PW PA PG PY PE PH PL PT QA RO RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB ZA KR ES LK SR CH TW TJ TZ TH TL TG TO TT TN TR TM TV UG AE GB US UY UZ VU VA VN ZM ZW");
var GEMINI_BLOCKED = setOf("CN CU IR KP SY");
var SERVICES = [
  { name: "ChatGPT", probe: "https://chatgpt.com/cdn-cgi/trace", supported: function (country) { return !!CHATGPT[country]; }, trace: true },
  { name: "Gemini", probe: "https://gemini.google.com/favicon.ico", supported: function (country) { return !GEMINI_BLOCKED[country]; } },
  { name: "Claude", probe: "https://claude.ai/favicon.ico", supported: function (country) { return !!CLAUDE[country]; } },
  { name: "Grok", probe: "https://grok.com/favicon.ico", supported: function (country) { return !GEMINI_BLOCKED[country]; } }
];

var results = [];
var pending = SERVICES.length;
SERVICES.forEach(checkService);

function checkService(service, index) {
  if (service.trace) {
    $httpClient.get(service.probe, function (error, response, data) {
      finish(service, error || !data ? null : parseTrace(data).loc);
    });
    return;
  }

  var marker = MARKER_PREFIX + index;
  $httpClient.get({
    url: service.probe + "?" + marker,
    headers: { "Range": "bytes=0-1024" },
    "auto-redirect": false
  }, function () {
    $httpAPI("GET", "/v1/requests/recent", null, function (recent) {
      var request = findRequest(recent && recent.requests, marker);
      var policy = request && (request.policyName || request.originalPolicyName);
      if (!policy) {
        finish(service, null);
        return;
      }
      $httpClient.get({ url: TRACE_URL, policy: policy }, function (error, response, data) {
        finish(service, error || !data ? null : parseTrace(data).loc);
      });
    });
  });
}

function findRequest(requests, marker) {
  if (!Array.isArray(requests)) return null;
  for (var i = 0; i < requests.length; i++) {
    if (String(requests[i].URL || "").indexOf(marker) !== -1) return requests[i];
  }
  return null;
}

function finish(service, country) {
  country = String(country || "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(country) || country === "XX" || country === "T1") {
    results.push({ name: service.name, region: "未知", state: "unknown" });
  } else if (!service.supported(country)) {
    results.push({ name: service.name, region: "未解锁", state: "blocked" });
  } else {
    results.push({ name: service.name, region: flag(country) + " " + country, state: "ok" });
  }

  pending -= 1;
  if (pending !== 0) return;

  var ordered = SERVICES.map(function (service) {
    return results.filter(function (item) { return item.name === service.name; })[0];
  });
  // Surge panels use a proportional font. U+2007 is a figure space: unlike
  // ordinary spaces, it has a stable visual width. The counts below bring
  // these six names to the visual width of “Perplexity”, aligning the result
  // column while retaining the full service names.
  var lines = ordered.map(function (item) {
    return padServiceName(item.name) + "  " + stateEmoji(item.state) + "  区域：" + item.region;
  });
  var allOk = ordered.every(function (item) { return item.state === "ok"; });
  $done({
    title: "AI 解锁地区",
    content: lines.join("\n"),
    icon: allOk ? "checkmark.seal.fill" : "exclamationmark.triangle.fill",
    "icon-color": allOk ? "#22A06B" : "#D65C51"
  });
}

function parseTrace(text) {
  return text.split("\n").reduce(function (result, line) {
    var index = line.indexOf("=");
    if (index > 0) result[line.slice(0, index)] = line.slice(index + 1);
    return result;
  }, {});
}

function setOf(text) {
  return text.split(/\s+/).reduce(function (result, item) {
    if (item) result[item] = true;
    return result;
  }, {});
}

function flag(country) {
  return String.fromCodePoint.apply(null, country.split("").map(function (letter) {
    return 127397 + letter.charCodeAt(0);
  }));
}

function padServiceName(name) {
  var padding = {
    "ChatGPT": 1.5,
    "Gemini": 3,
    "Claude": 3,
    "Grok": 4.5
  };
  return name + new Array((padding[name] || 0) + 1).join("\u2007");
}

function stateEmoji(state) {
  if (state === "ok") return "✅";
  if (state === "blocked") return "❌";
  return "❓";
}
