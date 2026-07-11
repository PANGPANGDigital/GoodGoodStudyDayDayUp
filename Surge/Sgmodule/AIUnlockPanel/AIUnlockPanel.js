/*
 * AI Service Availability Panel for Surge
 *
 * This panel checks the proxy egress country against regional availability
 * rules. It does not access any account, subscription, or chat history.
 * Region rules last reviewed: 2026-07.
 */

var TRACE_URL = "https://www.cloudflare.com/cdn-cgi/trace";

var CHATGPT = setOf(
  "AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CO KM CG CD CR HR CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PA PG PY PE PH PL PT QA RO RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB ZA KR ES LK SR SD CH TW TJ TZ TH TL TG TO TT TN TR TM TV UG AE GB US UY UZ VU VA VE VN YE ZM ZW"
);

var CLAUDE = setOf(
  "AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA TD CL CO KM CG CD CR HR CY CZ DK DJ DM DO EC EG SV GQ EE SZ FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ NA NR NP NL NZ NE NG MK NO OM PK PW PA PG PY PE PH PL PT QA RO RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB ZA KR ES LK SR CH TW TJ TZ TH TL TG TO TT TN TR TM TV UG AE GB US UY UZ VU VA VN ZM ZW"
);

var GEMINI_BLOCKED = setOf("CN CU IR KP SY");
var BROAD_BLOCKED = setOf("CN CU IR KP SY");

var SERVICES = [
  { name: "ChatGPT", supported: function (country) { return !!CHATGPT[country]; } },
  { name: "Gemini", supported: function (country) { return !GEMINI_BLOCKED[country]; } },
  { name: "Claude", supported: function (country) { return !!CLAUDE[country]; } },
  { name: "Copilot", supported: function (country) { return !BROAD_BLOCKED[country]; } },
  { name: "Perplexity", supported: function (country) { return !BROAD_BLOCKED[country]; } },
  { name: "Grok", supported: function (country) { return !BROAD_BLOCKED[country]; } }
];

$httpClient.get(TRACE_URL, function (error, response, data) {
  if (error || !data) {
    $done({
      title: "AI 服务解锁",
      content: "出口地区获取失败\n点击刷新后重试",
      icon: "wifi.exclamationmark",
      "icon-color": "#D65C51"
    });
    return;
  }

  var trace = readTrace(data);
  var country = (trace.loc || "XX").toUpperCase();
  var known = /^[A-Z]{2}$/.test(country) && country !== "XX" && country !== "T1";
  var checks = SERVICES.map(function (service) {
    return { name: service.name, ok: known && service.supported(country) };
  });
  var allOk = known && checks.every(function (item) { return item.ok; });
  var firstLine = "出口 " + toFlag(country) + " " + country + "  ·  " + (trace.ip || "IP 未知");
  var rows = [checks.slice(0, 3), checks.slice(3)].map(function (group) {
    return group.map(function (item) { return item.name + " " + (item.ok ? "✓" : "×"); }).join("   ");
  });

  $done({
    title: "AI 服务解锁",
    content: firstLine + "\n" + rows.join("\n"),
    icon: allOk ? "checkmark.seal.fill" : "exclamationmark.triangle.fill",
    "icon-color": allOk ? "#22A06B" : "#D65C51"
  });
});

function readTrace(text) {
  return text.split("\n").reduce(function (result, line) {
    var separator = line.indexOf("=");
    if (separator > 0) result[line.slice(0, separator)] = line.slice(separator + 1);
    return result;
  }, {});
}

function setOf(text) {
  return text.split(/\s+/).reduce(function (result, item) {
    if (item) result[item] = true;
    return result;
  }, {});
}

function toFlag(country) {
  if (!/^[A-Z]{2}$/.test(country)) return "🌐";
  return String.fromCodePoint.apply(null, country.split("").map(function (letter) {
    return 127397 + letter.charCodeAt(0);
  }));
}
