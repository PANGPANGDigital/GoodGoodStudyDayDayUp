/*
 * AI Unlock Panel for Surge
 *
 * This is a region-eligibility panel, not an account/login test. It uses
 * Cloudflare's trace endpoint only to determine the proxy egress country.
 * Region data last reviewed: 2026-07.
 *
 * Arguments (join with &):
 * title=AI%20Unlock
 * services=chatgpt,gemini,claude,copilot,perplexity,grok
 * icon=brain.head.profile&icon-color=#7C3AED
 * iconerr=xmark.seal.fill&iconerr-color=#D65C51
 * force-country=US              // useful for testing, omit in normal use
 */

var TRACE_URL = "https://chatgpt.com/cdn-cgi/trace";

// ISO-3166 alpha-2 codes. The ChatGPT list is also a deliberately useful
// baseline for Claude, whose consumer availability is similarly broad but
// not identical. Keep separate sets so changes stay easy to audit.
var CHATGPT_REGIONS = toSet(
  "AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CO KM CG CD CR HR CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PA PG PY PE PH PL PT QA RO RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB ZA KR ES LK SR SD CH TW TJ TZ TH TL TG TO TT TN TR TM TV UG AE GB US UY UZ VU VA VE VN YE ZM ZW"
);

var CLAUDE_REGIONS = toSet(
  "AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA TD CL CO KM CG CD CR HR CY CZ DK DJ DM DO EC EG SV GQ EE SZ FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ NA NR NP NL NZ NE NG MK NO OM PK PW PA PG PY PE PH PL PT QA RO RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB ZA KR ES LK SR CH TW TJ TZ TH TL TG TO TT TN TR TM TV UG AE GB US UY UZ VU VA VN ZM ZW"
);

// Gemini web is offered in more than 230 countries/territories. Mainland
// China only has a Workspace exception, so it is marked unavailable here for
// personal Gemini web. These are conservative consumer-web exclusions.
var GEMINI_BLOCKED = toSet("CN CU IR KP SY");
var BROAD_SERVICE_BLOCKED = toSet("CN CU IR KP SY");

var SERVICE_ORDER = ["chatgpt", "gemini", "claude", "copilot", "perplexity", "grok"];
var SERVICE_NAMES = {
  chatgpt: "ChatGPT",
  gemini: "Gemini",
  claude: "Claude",
  copilot: "Copilot",
  perplexity: "Perplexity",
  grok: "Grok"
};

var args = parseArguments(typeof $argument === "undefined" ? "" : $argument);
var requestedServices = (args.services || SERVICE_ORDER.join(","))
  .toLowerCase()
  .split(",")
  .map(function (name) { return name.trim(); })
  .filter(function (name) { return SERVICE_NAMES[name]; });
if (!requestedServices.length) requestedServices = SERVICE_ORDER;

$httpClient.get(TRACE_URL, function (error, response, data) {
  if (error || !data) {
    finishError("无法获取出口地区");
    return;
  }

  var trace = parseTrace(data);
  var country = (args["force-country"] || trace.loc || "XX").toUpperCase();
  var knownCountry = country !== "XX" && country !== "T1";
  var results = requestedServices.map(function (service) {
    return { name: SERVICE_NAMES[service], available: knownCountry && isSupported(service, country) };
  });
  var allAvailable = knownCountry && results.every(function (item) { return item.available; });
  var location = flag(country) + " " + country;
  var warp = ["on", "plus"].indexOf(trace.warp) !== -1 ? "✓" : "–";

  var resultLines = chunk(results, 3).map(function (group) {
    return group.map(function (item) {
      return item.name + (item.available ? " ✓" : " ✕");
    }).join("   ");
  });

  $done({
    title: args.title || "AI Unlock",
    content: location + "  ·  " + (trace.ip || "IP 未知") + "  ·  WARP " + warp + "\n" + resultLines.join("\n"),
    icon: allAvailable ? (args.icon || "brain.head.profile") : (args.iconerr || "xmark.seal.fill"),
    "icon-color": allAvailable ? (args["icon-color"] || "#7C3AED") : (args["iconerr-color"] || "#D65C51")
  });
});

function isSupported(service, country) {
  if (service === "chatgpt") return !!CHATGPT_REGIONS[country];
  if (service === "claude") return !!CLAUDE_REGIONS[country];
  if (service === "gemini") return !GEMINI_BLOCKED[country];
  // These services publish no practical consumer-country allow list. This is
  // therefore only a broad regional eligibility hint, not a guarantee.
  return !BROAD_SERVICE_BLOCKED[country];
}

function parseTrace(text) {
  return text.split("\n").reduce(function (result, line) {
    var index = line.indexOf("=");
    if (index > 0) result[line.slice(0, index)] = line.slice(index + 1);
    return result;
  }, {});
}

function parseArguments(text) {
  return text.split("&").reduce(function (result, item) {
    var index = item.indexOf("=");
    if (index < 0) return result;
    var key = item.slice(0, index);
    var value = item.slice(index + 1);
    try { result[key] = decodeURIComponent(value.replace(/\+/g, " ")); }
    catch (e) { result[key] = value; }
    return result;
  }, {});
}

function toSet(text) {
  return text.split(/\s+/).reduce(function (result, code) {
    if (code) result[code] = true;
    return result;
  }, {});
}

function chunk(items, size) {
  var groups = [];
  for (var i = 0; i < items.length; i += size) groups.push(items.slice(i, i + size));
  return groups;
}

function flag(country) {
  if (!/^[A-Z]{2}$/.test(country)) return "🌐";
  return String.fromCodePoint.apply(null, country.split("").map(function (letter) {
    return 127397 + letter.charCodeAt(0);
  }));
}

function finishError(message) {
  $done({
    title: args.title || "AI Unlock",
    content: message,
    icon: args.iconerr || "wifi.exclamationmark",
    "icon-color": args["iconerr-color"] || "#D65C51"
  });
}
