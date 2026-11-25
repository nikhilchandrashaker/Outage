import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Cell, ReferenceLine,
} from "recharts";

/* =========================================================================
   Weather-Driven Power Outage Predictor — dashboard
   All figures below are produced by build_dataset.py from a SYNTHETIC dataset.
   Model: logistic regression (train 2023-24, test 2025). The what-if simulator
   uses the exact fitted coefficients.
   ========================================================================= */

const D = {"res":{"logistic":{"auc":0.8916898470097356,"ap":0.46904287849237747,"brier":0.01067695013241341},"gbm":{"auc":0.8567020166898469,"ap":0.23878459274515437,"brier":0.016472997073559523},"base_rate_test":0.015068493150684932,"n_train":5848,"n_test":2920},"thr":[{"t":0.02,"precision":0.10434782608695652,"recall":0.8181818181818182,"f1":0.18508997429305912,"flagged":345},{"t":0.05,"precision":0.16216216216216217,"recall":0.6818181818181818,"f1":0.26200873362445415,"flagged":185},{"t":0.1,"precision":0.2413793103448276,"recall":0.6363636363636364,"f1":0.35,"flagged":116},{"t":0.15,"precision":0.34615384615384615,"recall":0.6136363636363636,"f1":0.4426229508196721,"flagged":78},{"t":0.2,"precision":0.41935483870967744,"recall":0.5909090909090909,"f1":0.49056603773584906,"flagged":62},{"t":0.3,"precision":0.44,"recall":0.5,"f1":0.46808510638297873,"flagged":50},{"t":0.4,"precision":0.5588235294117647,"recall":0.4318181818181818,"f1":0.48717948717948717,"flagged":34},{"t":0.5,"precision":0.6818181818181818,"recall":0.3409090909090909,"f1":0.45454545454545453,"flagged":22}],"cal":[{"pred":0.0015486560576018623,"obs":0.0024521824423737125,"n":2039,"label":"(-0.001, 0.005]"},{"pred":0.00706916179115356,"obs":0.006060606060606061,"n":330,"label":"(0.005, 0.01]"},{"pred":0.014187620862354934,"obs":0.0048543689320388345,"n":206,"label":"(0.01, 0.02]"},{"pred":0.030731967579561054,"obs":0.0375,"n":160,"label":"(0.02, 0.05]"},{"pred":0.07332359671027672,"obs":0.028985507246376812,"n":69,"label":"(0.05, 0.1]"},{"pred":0.1377541852688174,"obs":0.037037037037037035,"n":54,"label":"(0.1, 0.2]"},{"pred":0.4883502412708554,"obs":0.41935483870967744,"n":62,"label":"(0.2, 1.0]"}],"imp":[["wind_gust_mph",0.9971787997523586],["tree_canopy_pct",0.4800681441996789],["temp_min_f",0.40035320756970294],["precip_in",0.3963968820450267],["snow_in",0.3177559894946023],["underground_pct",0.28806658668438767],["soil_moisture_7d_in",0.2813847384688648],["ice_accum_in",0.22601659037915942],["grid_age_index",0.21311383584198346],["lightning_strikes",0.15468005370111418],["prior_day_gust_mph",0.14549778007283407],["temp_max_f",0.1280541614240907],["wind_avg_mph",0.12758814278892014],["humidity_pct",0.11303243658849503]],"coef":{"temp_max_f":-0.1280541614240907,"temp_min_f":0.40035320756970294,"wind_avg_mph":0.12758814278892014,"wind_gust_mph":0.9971787997523586,"prior_day_gust_mph":0.14549778007283407,"precip_in":0.3963968820450267,"snow_in":0.3177559894946023,"ice_accum_in":0.22601659037915942,"humidity_pct":-0.11303243658849503,"lightning_strikes":0.15468005370111418,"soil_moisture_7d_in":0.2813847384688648,"tree_canopy_pct":0.4800681441996789,"grid_age_index":0.21311383584198346,"underground_pct":-0.28806658668438767},"mean":{"temp_max_f":71.40095759233927,"temp_min_f":55.42318741450069,"wind_avg_mph":10.059233926128591,"wind_gust_mph":19.403437072503422,"prior_day_gust_mph":19.41860465116279,"precip_in":0.17630984952120382,"snow_in":0.1877564979480164,"ice_accum_in":0.0022041723666210676,"humidity_pct":67.22845417236663,"lightning_strikes":3.0772913816689464,"soil_moisture_7d_in":1.2092971956224352,"tree_canopy_pct":39.75,"grid_age_index":0.6025,"underground_pct":0.27249999999999996},"scale":{"temp_max_f":16.964241656468165,"temp_min_f":17.00308733023734,"wind_avg_mph":7.123055346590139,"wind_gust_mph":14.62197202226538,"prior_day_gust_mph":14.658936218187787,"precip_in":0.4624636574904347,"snow_in":1.5758090969606044,"ice_accum_in":0.03856055743863796,"humidity_pct":15.070086974315261,"lightning_strikes":11.126488466922671,"soil_moisture_7d_in":1.4010525169231929,"tree_canopy_pct":18.109044701474453,"grid_age_index":0.09377499666755525,"underground_pct":0.1280380802730188},"intercept":-6.017166070883681,"monthly":[0.0269,0.0265,0.0175,0.0153,0.0094,0.0236,0.0121,0.0202,0.0167,0.0081,0.0194,0.0175],"regions":[{"region":"Coastal Bluffs","rate":0.006386861313868613,"avg_out":12728.285714285714,"cust":420000,"climate":"coastal","age":0.55,"ug":0.3,"canopy":35},{"region":"Desert Basin","rate":0.002737226277372263,"avg_out":3675.0,"cust":280000,"climate":"desert","age":0.45,"ug":0.35,"canopy":8},{"region":"Great Lakes Shore","rate":0.030109489051094892,"avg_out":19848.121212121212,"cust":480000,"climate":"lake-snow","age":0.75,"ug":0.28,"canopy":45},{"region":"Gulf Plains","rate":0.032846715328467155,"avg_out":14432.055555555555,"cust":520000,"climate":"hurricane-thunderstorm","age":0.5,"ug":0.25,"canopy":40},{"region":"Metro Core","rate":0.0018248175182481751,"avg_out":6174.0,"cust":900000,"climate":"urban","age":0.6,"ug":0.55,"canopy":20},{"region":"Mountain West","rate":0.01916058394160584,"avg_out":6625.571428571428,"cust":200000,"climate":"snow-wind","age":0.62,"ug":0.12,"canopy":55},{"region":"Piedmont Hills","rate":0.028284671532846715,"avg_out":11841.516129032258,"cust":350000,"climate":"forest-ice","age":0.65,"ug":0.18,"canopy":70},{"region":"Valley Foothills","rate":0.020072992700729927,"avg_out":6763.5,"cust":310000,"climate":"wildfire-wind","age":0.7,"ug":0.15,"canopy":45}],"rm":[{"region":"Coastal Bluffs","1":0.011,"2":0.0,"3":0.0,"4":0.0,"5":0.011,"6":0.0,"7":0.0,"8":0.0,"9":0.011,"10":0.011,"11":0.033,"12":0.0},{"region":"Desert Basin","1":0.0,"2":0.012,"3":0.0,"4":0.0,"5":0.0,"6":0.0,"7":0.011,"8":0.0,"9":0.0,"10":0.011,"11":0.0,"12":0.0},{"region":"Great Lakes Shore","1":0.054,"2":0.059,"3":0.022,"4":0.022,"5":0.0,"6":0.044,"7":0.011,"8":0.022,"9":0.022,"10":0.011,"11":0.033,"12":0.065},{"region":"Gulf Plains","1":0.043,"2":0.012,"3":0.065,"4":0.067,"5":0.011,"6":0.022,"7":0.032,"8":0.032,"9":0.044,"10":0.0,"11":0.033,"12":0.032},{"region":"Metro Core","1":0.011,"2":0.0,"3":0.011,"4":0.0,"5":0.0,"6":0.0,"7":0.0,"8":0.0,"9":0.0,"10":0.0,"11":0.0,"12":0.0},{"region":"Mountain West","1":0.022,"2":0.047,"3":0.022,"4":0.0,"5":0.0,"6":0.022,"7":0.011,"8":0.032,"9":0.011,"10":0.0,"11":0.033,"12":0.032},{"region":"Piedmont Hills","1":0.043,"2":0.071,"3":0.011,"4":0.011,"5":0.032,"6":0.056,"7":0.022,"8":0.043,"9":0.011,"10":0.022,"11":0.022,"12":0.0},{"region":"Valley Foothills","1":0.032,"2":0.012,"3":0.011,"4":0.022,"5":0.022,"6":0.044,"7":0.011,"8":0.032,"9":0.033,"10":0.011,"11":0.0,"12":0.011}],"bygust":[{"b":"<20","mean":0.0034602076124567475,"size":5491},{"b":"20-30","mean":0.009369144284821987,"size":1601},{"b":"30-40","mean":0.02112676056338028,"size":852},{"b":"40-50","mean":0.04408352668213457,"size":431},{"b":"50-60","mean":0.1091703056768559,"size":229},{"b":"60+","mean":0.3597560975609756,"size":164}],"byprecip":[{"b":"0","mean":0.0059046177138531416,"size":6605},{"b":"0-.25","mean":0.01020408163265306,"size":588},{"b":".25-.5","mean":0.028077753779697623,"size":463},{"b":".5-1","mean":0.04847396768402154,"size":557},{"b":"1-2","mean":0.09738717339667459,"size":421},{"b":"2+","mean":0.21641791044776118,"size":134}],"ice":{"Ice >0.1in":0.4324,"No/low ice":0.0159},"top":[{"date":"2025-12-16","region":"Mountain West","wind_gust_mph":41.9,"precip_in":1.43,"snow_in":13.9,"ice_accum_in":0.81,"p":0.981,"outage_event":1,"customers_out":1008},{"date":"2025-12-10","region":"Great Lakes Shore","wind_gust_mph":55.5,"precip_in":3.26,"snow_in":21.2,"ice_accum_in":0.0,"p":0.978,"outage_event":1,"customers_out":15441},{"date":"2025-01-02","region":"Mountain West","wind_gust_mph":32.2,"precip_in":1.52,"snow_in":16.5,"ice_accum_in":0.73,"p":0.969,"outage_event":1,"customers_out":1254},{"date":"2025-12-02","region":"Great Lakes Shore","wind_gust_mph":65.1,"precip_in":0.97,"snow_in":10.8,"ice_accum_in":0.54,"p":0.968,"outage_event":1,"customers_out":161612},{"date":"2025-01-04","region":"Valley Foothills","wind_gust_mph":120.5,"precip_in":0.59,"snow_in":0.0,"ice_accum_in":0.0,"p":0.899,"outage_event":1,"customers_out":30644},{"date":"2025-07-05","region":"Gulf Plains","wind_gust_mph":47.0,"precip_in":4.23,"snow_in":0.0,"ice_accum_in":0.0,"p":0.859,"outage_event":0,"customers_out":0},{"date":"2025-02-01","region":"Great Lakes Shore","wind_gust_mph":20.3,"precip_in":1.58,"snow_in":12.1,"ice_accum_in":0.72,"p":0.846,"outage_event":1,"customers_out":9273},{"date":"2025-01-26","region":"Piedmont Hills","wind_gust_mph":54.0,"precip_in":2.03,"snow_in":14.9,"ice_accum_in":0.0,"p":0.844,"outage_event":0,"customers_out":0}],"overall":0.017677919708029198,"rows":8768,"lift5":{"rate":0.2054794520547945,"base":0.015068493150684932,"captured":0.6818181818181818,"k":146}};

const C = {
  bg: "#f6f7f9", card: "#ffffff", ink: "#14181f", sub: "#5b6573", line: "#e3e6eb",
  blue: "#2563eb", teal: "#0d9488", amber: "#d97706", red: "#dc2626", violet: "#7c3aed", grey: "#94a3b8",
};
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const pct = (v, d = 1) => (v * 100).toFixed(d) + "%";
const FEATURE_LABELS = {
  wind_gust_mph: "Wind gust", tree_canopy_pct: "Tree canopy", temp_min_f: "Min temp", precip_in: "Precipitation",
  snow_in: "Snowfall", underground_pct: "Underground lines", soil_moisture_7d_in: "7-day soil moisture",
  ice_accum_in: "Ice accumulation", grid_age_index: "Grid age", lightning_strikes: "Lightning",
  prior_day_gust_mph: "Prior-day gust", temp_max_f: "Max temp", wind_avg_mph: "Avg wind", humidity_pct: "Humidity",
};

const tier = (p) =>
  p < 0.02 ? { name: "Low", color: C.teal } :
  p < 0.10 ? { name: "Elevated", color: C.amber } :
  p < 0.30 ? { name: "High", color: "#ea580c" } :
  { name: "Severe", color: C.red };

function Card({ title, sub, children, style }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 18, ...style }}>
      {title && <div style={{ fontWeight: 650, fontSize: 15, color: C.ink }}>{title}</div>}
      {sub && <div style={{ fontSize: 12.5, color: C.sub, margin: "2px 0 12px" }}>{sub}</div>}
      {!sub && title && <div style={{ height: 10 }} />}
      {children}
    </div>
  );
}

function Kpi({ label, value, note, color }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: "14px 16px", flex: 1, minWidth: 150 }}>
      <div style={{ fontSize: 12, color: C.sub, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: color || C.ink, lineHeight: 1.2 }}>{value}</div>
      {note && <div style={{ fontSize: 12, color: C.sub }}>{note}</div>}
    </div>
  );
}

function Slider({ label, unit, value, min, max, step, onChange }) {
  return (
    <label style={{ display: "block", marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.sub }}>
        <span>{label}</span>
        <span style={{ color: C.ink, fontWeight: 600 }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))} style={{ width: "100%", accentColor: C.blue }} />
    </label>
  );
}

/* ---------- Overview ---------- */
function Overview() {
  const monthly = D.monthly.map((v, i) => ({ m: MONTHS[i], rate: +(v * 100).toFixed(2) }));
  const regs = [...D.regions].sort((a, b) => b.rate - a.rate).map((r) => ({ ...r, ratePct: +(r.rate * 100).toFixed(2) }));
  const maxCell = Math.max(...D.rm.flatMap((r) => MONTHS.map((_, i) => r[String(i + 1)] || 0)));
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 16 }}>
        <Card title="Outage-day rate by month" sub="Share of region-days with a weather-driven outage event (all regions, 2023–25)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthly}>
              <CartesianGrid stroke={C.line} vertical={false} />
              <XAxis dataKey="m" tickLine={false} fontSize={12} />
              <YAxis unit="%" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip formatter={(v) => v + "%"} />
              <Bar dataKey="rate" name="Outage-day rate" fill={C.blue} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Risk by region" sub="Outage-day rate, with grid and vegetation context">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={regs} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid stroke={C.line} horizontal={false} />
              <XAxis type="number" unit="%" tickLine={false} fontSize={12} />
              <YAxis type="category" dataKey="region" width={120} tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip formatter={(v) => v + "%"} />
              <Bar dataKey="ratePct" name="Outage-day rate" fill={C.violet} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Region × month heatmap" sub="Outage-day rate; darker = riskier. Seasonality differs by climate type.">
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 6, color: C.sub }}>Region</th>
                {MONTHS.map((m) => <th key={m} style={{ padding: 6, color: C.sub, fontWeight: 500 }}>{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {D.rm.map((r) => (
                <tr key={r.region}>
                  <td style={{ padding: 6, whiteSpace: "nowrap", color: C.ink }}>{r.region}</td>
                  {MONTHS.map((_, i) => {
                    const v = r[String(i + 1)] || 0;
                    const a = Math.min(1, v / maxCell);
                    return (
                      <td key={i} title={pct(v)} style={{
                        padding: "7px 4px", textAlign: "center",
                        background: `rgba(37,99,235,${0.06 + a * 0.85})`,
                        color: a > 0.55 ? "#fff" : C.ink, border: "2px solid #fff",
                      }}>{(v * 100).toFixed(0)}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Region profiles" sub="Static grid attributes used as model inputs">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ color: C.sub, textAlign: "left" }}>
                {["Region", "Climate", "Customers", "Canopy", "Grid age idx", "Underground", "Outage-day rate", "Avg customers out*"].map((h) => (
                  <th key={h} style={{ padding: "6px 8px", fontWeight: 500, borderBottom: `1px solid ${C.line}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {regs.map((r) => (
                <tr key={r.region}>
                  <td style={{ padding: "6px 8px", fontWeight: 600 }}>{r.region}</td>
                  <td style={{ padding: "6px 8px", color: C.sub }}>{r.climate}</td>
                  <td style={{ padding: "6px 8px" }}>{r.cust.toLocaleString()}</td>
                  <td style={{ padding: "6px 8px" }}>{r.canopy}%</td>
                  <td style={{ padding: "6px 8px" }}>{r.age.toFixed(2)}</td>
                  <td style={{ padding: "6px 8px" }}>{(r.ug * 100).toFixed(0)}%</td>
                  <td style={{ padding: "6px 8px" }}>{pct(r.rate)}</td>
                  <td style={{ padding: "6px 8px" }}>{Math.round(r.avg_out).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: 11.5, color: C.sub, marginTop: 6 }}>*On outage days only.</div>
        </div>
      </Card>
    </div>
  );
}

/* ---------- Drivers ---------- */
function Drivers() {
  const gust = D.bygust.map((r) => ({ b: r.b, rate: +(r.mean * 100).toFixed(2), n: r.size }));
  const precip = D.byprecip.map((r) => ({ b: r.b, rate: +(r.mean * 100).toFixed(2), n: r.size }));
  const imp = D.imp.map(([f, v]) => ({ f: FEATURE_LABELS[f] || f, v: +v.toFixed(3) }));
  const iceHi = D.ice["Ice >0.1in"], iceLo = D.ice["No/low ice"];
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 16 }}>
        <Card title="Wind gust → outage rate" sub="Outage-day rate by daily peak gust bucket (mph)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={gust}>
              <CartesianGrid stroke={C.line} vertical={false} />
              <XAxis dataKey="b" tickLine={false} fontSize={12} />
              <YAxis unit="%" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip formatter={(v, n, p) => [v + "%", `n = ${p.payload.n.toLocaleString()}`]} />
              <Bar dataKey="rate" fill={C.red} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Precipitation → outage rate" sub="Outage-day rate by daily precipitation bucket (inches)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={precip}>
              <CartesianGrid stroke={C.line} vertical={false} />
              <XAxis dataKey="b" tickLine={false} fontSize={12} />
              <YAxis unit="%" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip formatter={(v, n, p) => [v + "%", `n = ${p.payload.n.toLocaleString()}`]} />
              <Bar dataKey="rate" fill={C.teal} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(260px,1fr) minmax(340px,2fr)", gap: 16 }}>
        <Card title="Ice is the sharpest trigger" sub="Outage-day rate by ice accumulation">
          <div style={{ display: "flex", gap: 12 }}>
            <Kpi label="Ice > 0.1 in" value={pct(iceHi, 0)} color={C.red} />
            <Kpi label="Little / no ice" value={pct(iceLo)} color={C.teal} />
          </div>
          <div style={{ fontSize: 12.5, color: C.sub, marginTop: 10 }}>
            About {(iceHi / iceLo).toFixed(0)}× the baseline. Ice days are rare, so the effect is concentrated in the cold-climate regions.
          </div>
        </Card>
        <Card title="What the model leans on" sub="Absolute standardized logistic coefficients (one unit = one standard deviation)">
          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={imp} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid stroke={C.line} horizontal={false} />
              <XAxis type="number" tickLine={false} fontSize={12} />
              <YAxis type="category" dataKey="f" width={130} tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="v" name="|coef|" radius={[0, 4, 4, 0]}>
                {imp.map((d, i) => <Cell key={i} fill={i === 0 ? C.red : i < 4 ? C.blue : C.grey} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Model ---------- */
function Model() {
  const [ti, setTi] = useState(4);
  const t = D.thr[ti];
  const cal = D.cal.map((r) => ({ bin: r.label.replace(/[()\[\]]/g, ""), predicted: +(r.pred * 100).toFixed(1), observed: +(r.obs * 100).toFixed(1), n: r.n }));
  const L = D.res.logistic, G = D.res.gbm;
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Kpi label="ROC AUC (2025 holdout)" value={L.auc.toFixed(3)} note={`GBM comparison: ${G.auc.toFixed(3)}`} color={C.blue} />
        <Kpi label="Avg precision" value={L.ap.toFixed(3)} note={`Base rate ${pct(D.res.base_rate_test)} · GBM ${G.ap.toFixed(3)}`} />
        <Kpi label="Brier score" value={L.brier.toFixed(4)} note={`GBM ${G.brier.toFixed(4)} (lower is better)`} />
        <Kpi label="Top-5% days capture" value={pct(D.lift5.captured, 0)} note={`of outages; ${pct(D.lift5.rate, 0)} hit rate vs ${pct(D.lift5.base)} base`} color={C.teal} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 16 }}>
        <Card title="Calibration on 2025 holdout" sub="Predicted vs observed outage rate per risk bin. Close bars = trustworthy probabilities.">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={cal}>
              <CartesianGrid stroke={C.line} vertical={false} />
              <XAxis dataKey="bin" tickLine={false} fontSize={11} />
              <YAxis unit="%" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="predicted" fill={C.grey} radius={[4, 4, 0, 0]} />
              <Bar dataKey="observed" fill={C.blue} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 12, color: C.sub }}>
            The model over-predicts in the 5–20% bins and is well calibrated above 20%. Bins hold few events, so read with caution.
          </div>
        </Card>

        <Card title="Alert threshold trade-off" sub="Pick a probability cutoff for issuing a high-risk alert">
          <div style={{ fontSize: 12.5, color: C.sub, marginBottom: 6 }}>Alert when P(outage) ≥</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {D.thr.map((r, i) => (
              <button key={i} onClick={() => setTi(i)} style={{
                padding: "4px 10px", borderRadius: 999, border: `1px solid ${i === ti ? C.blue : C.line}`,
                background: i === ti ? C.blue : "#fff", color: i === ti ? "#fff" : C.ink, cursor: "pointer", fontSize: 12.5,
              }}>{pct(r.t, 0)}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Kpi label="Precision" value={pct(t.precision, 0)} note="alerts that were real" />
            <Kpi label="Recall" value={pct(t.recall, 0)} note="outages caught" color={C.teal} />
            <Kpi label="Alert days" value={t.flagged} note={`of ${D.res.n_test.toLocaleString()} region-days`} />
          </div>
          <div style={{ fontSize: 12.5, color: C.sub, marginTop: 10 }}>
            Lower cutoffs catch more outages but cry wolf more. Crews staging for restoration usually favor recall; public notifications favor precision.
          </div>
        </Card>
      </div>

      <Card title="Highest-risk days in the holdout" sub="Top predictions from 2025 and what actually happened">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ color: C.sub, textAlign: "left" }}>
                {["Date", "Region", "Gust mph", "Precip in", "Snow in", "Ice in", "Predicted", "Outage?", "Customers out"].map((h) => (
                  <th key={h} style={{ padding: "6px 8px", fontWeight: 500, borderBottom: `1px solid ${C.line}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {D.top.map((r, i) => (
                <tr key={i}>
                  <td style={{ padding: "6px 8px" }}>{r.date}</td>
                  <td style={{ padding: "6px 8px", fontWeight: 600 }}>{r.region}</td>
                  <td style={{ padding: "6px 8px" }}>{r.wind_gust_mph}</td>
                  <td style={{ padding: "6px 8px" }}>{r.precip_in}</td>
                  <td style={{ padding: "6px 8px" }}>{r.snow_in}</td>
                  <td style={{ padding: "6px 8px" }}>{r.ice_accum_in}</td>
                  <td style={{ padding: "6px 8px" }}>{pct(r.p, 0)}</td>
                  <td style={{ padding: "6px 8px", color: r.outage_event ? C.red : C.teal, fontWeight: 600 }}>{r.outage_event ? "Yes" : "No"}</td>
                  <td style={{ padding: "6px 8px" }}>{r.customers_out.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ---------- Simulator ---------- */
const PRESETS = {
  "Calm day": { gust: 12, precip: 0, snow: 0, ice: 0, tmax: 68, tmin: 50, hum: 55, light: 0, soil: 0, prior: 10 },
  "Windstorm": { gust: 58, precip: 0.4, snow: 0, ice: 0, tmax: 62, tmin: 48, hum: 60, light: 2, soil: 1.2, prior: 35 },
  "Ice storm": { gust: 28, precip: 0.6, snow: 0, ice: 0.5, tmax: 33, tmin: 26, hum: 88, light: 0, soil: 1.5, prior: 18 },
  "T-storm": { gust: 52, precip: 1.8, snow: 0, ice: 0, tmax: 86, tmin: 70, hum: 85, light: 120, soil: 2.5, prior: 25 },
  "Snow squall": { gust: 40, precip: 0.8, snow: 9, ice: 0, tmax: 30, tmin: 18, hum: 80, light: 0, soil: 0.6, prior: 28 },
};

function Simulator() {
  const [region, setRegion] = useState(D.regions[0].region);
  const [x, setX] = useState(PRESETS["Windstorm"]);
  const set = (k) => (v) => setX((p) => ({ ...p, [k]: v }));
  const reg = D.regions.find((r) => r.region === region);

  const { p, contrib } = useMemo(() => {
    const f = {
      temp_max_f: x.tmax, temp_min_f: x.tmin, wind_avg_mph: +(x.gust / 1.75).toFixed(1), wind_gust_mph: x.gust,
      prior_day_gust_mph: x.prior, precip_in: x.precip, snow_in: x.snow, ice_accum_in: x.ice, humidity_pct: x.hum,
      lightning_strikes: x.light, soil_moisture_7d_in: x.soil, tree_canopy_pct: reg.canopy,
      grid_age_index: reg.age, underground_pct: reg.ug,
    };
    let z = D.intercept;
    const parts = [];
    Object.keys(f).forEach((k) => {
      const c = D.coef[k] * ((f[k] - D.mean[k]) / D.scale[k]);
      z += c;
      parts.push({ k, label: FEATURE_LABELS[k] || k, c });
    });
    parts.sort((a, b) => Math.abs(b.c) - Math.abs(a.c));
    return { p: 1 / (1 + Math.exp(-z)), contrib: parts.slice(0, 7) };
  }, [x, reg]);

  const t = tier(p);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 16 }}>
      <Card title="Forecast inputs" sub="Set tomorrow's forecast and choose a region">
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {Object.keys(PRESETS).map((n) => (
            <button key={n} onClick={() => setX(PRESETS[n])} style={{
              padding: "4px 10px", borderRadius: 999, border: `1px solid ${C.line}`, background: "#fff", cursor: "pointer", fontSize: 12.5,
            }}>{n}</button>
          ))}
        </div>
        <select value={region} onChange={(e) => setRegion(e.target.value)} style={{
          width: "100%", padding: 8, borderRadius: 8, border: `1px solid ${C.line}`, marginBottom: 12, fontSize: 13.5,
        }}>
          {D.regions.map((r) => <option key={r.region} value={r.region}>{r.region} ({r.climate})</option>)}
        </select>
        <Slider label="Peak gust" unit=" mph" value={x.gust} min={0} max={90} step={1} onChange={set("gust")} />
        <Slider label="Prior-day peak gust" unit=" mph" value={x.prior} min={0} max={90} step={1} onChange={set("prior")} />
        <Slider label="Precipitation" unit=" in" value={x.precip} min={0} max={4} step={0.05} onChange={set("precip")} />
        <Slider label="Snowfall" unit=" in" value={x.snow} min={0} max={20} step={0.5} onChange={set("snow")} />
        <Slider label="Ice accumulation" unit=" in" value={x.ice} min={0} max={1} step={0.05} onChange={set("ice")} />
        <Slider label="Max temp" unit="°F" value={x.tmax} min={0} max={115} step={1} onChange={set("tmax")} />
        <Slider label="Min temp" unit="°F" value={x.tmin} min={-10} max={90} step={1} onChange={set("tmin")} />
        <Slider label="Humidity" unit="%" value={x.hum} min={10} max={100} step={1} onChange={set("hum")} />
        <Slider label="Lightning strikes" unit="" value={x.light} min={0} max={300} step={5} onChange={set("light")} />
        <Slider label="7-day soil moisture" unit=" in" value={x.soil} min={0} max={6} step={0.1} onChange={set("soil")} />
      </Card>

      <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
        <Card title={`Outage risk — ${region}`}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <div style={{ fontSize: 52, fontWeight: 750, color: t.color, lineHeight: 1 }}>{pct(p, p < 0.1 ? 1 : 0)}</div>
            <div style={{ fontSize: 18, fontWeight: 650, color: t.color }}>{t.name}</div>
          </div>
          <div style={{ height: 10, background: C.line, borderRadius: 6, margin: "14px 0 6px", overflow: "hidden" }}>
            <div style={{ width: `${Math.min(100, p * 100)}%`, height: "100%", background: t.color, transition: "width .2s" }} />
          </div>
          <div style={{ fontSize: 12.5, color: C.sub }}>
            Probability of a weather-driven outage event in this region tomorrow. Typical day: {pct(D.overall)}.
          </div>
        </Card>
        <Card title="Why" sub="Largest contributions to the log-odds (positive pushes risk up)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={contrib.map((c) => ({ ...c, c: +c.c.toFixed(2) }))} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid stroke={C.line} horizontal={false} />
              <XAxis type="number" tickLine={false} fontSize={12} />
              <YAxis type="category" dataKey="label" width={130} tickLine={false} axisLine={false} fontSize={12} />
              <ReferenceLine x={0} stroke={C.ink} />
              <Tooltip />
              <Bar dataKey="c" name="log-odds contribution" radius={[0, 4, 4, 0]}>
                {contrib.map((c, i) => <Cell key={i} fill={c.c >= 0 ? C.red : C.teal} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ---------- App ---------- */
const TABS = [["Overview", Overview], ["Weather drivers", Drivers], ["Model", Model], ["What-if simulator", Simulator]];

export default function OutagePredictorDashboard() {
  const [tab, setTab] = useState(0);
  const Active = TABS[tab][1];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: 20, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif", color: C.ink }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 24, fontWeight: 750 }}>Weather-Driven Power Outage Predictor</div>
          <div style={{ fontSize: 13.5, color: C.sub }}>
            {D.rows.toLocaleString()} region-days · 8 regions · 2023–2025 · synthetic data · train 2023–24, test 2025
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <Kpi label="Outage-day rate" value={pct(D.overall)} note="share of region-days with an event" />
          <Kpi label="Holdout AUC" value={D.res.logistic.auc.toFixed(2)} note="logistic regression" color={C.blue} />
          <Kpi label="Ice-day outage rate" value={pct(D.ice["Ice >0.1in"], 0)} note="ice > 0.1 in" color={C.red} />
          <Kpi label="Top-gust bucket rate" value={pct(D.bygust[D.bygust.length - 1].mean, 0)} note="gusts 60+ mph" color={C.amber} />
        </div>
        <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${C.line}`, marginBottom: 16, flexWrap: "wrap" }}>
          {TABS.map(([name], i) => (
            <button key={name} onClick={() => setTab(i)} style={{
              padding: "9px 16px", border: "none", background: "none", cursor: "pointer", fontSize: 14,
              fontWeight: i === tab ? 650 : 500, color: i === tab ? C.blue : C.sub,
              borderBottom: `2px solid ${i === tab ? C.blue : "transparent"}`, marginBottom: -1,
            }}>{name}</button>
          ))}
        </div>
        <Active />
        <div style={{ fontSize: 12, color: C.sub, marginTop: 20 }}>
          Data is simulated for portfolio use and does not describe real utilities. See README for method and limitations.
        </div>
      </div>
    </div>
  );
}
