# Weather-Driven Power Outage Predictor

Predict the probability that a region suffers a weather-driven power outage event tomorrow, from the weather forecast plus a few static grid attributes (tree canopy, grid age, underground line share).

> **Data is synthetic.** The dataset was simulated with weather-to-outage relationships I wrote down from domain intuition (gusts, ice loading, saturated soil, canopy, aging equipment). It does not describe any real utility. The model therefore recovers the structure I put in; it is a demonstration of the pipeline, not evidence about real grids. See [Limitations](#limitations).

## Deliverables

| File | What it is |
|---|---|
| `power_outage_dataset.csv` | 8,768 region-day rows, 22 columns |
| `outage_dashboard.jsx` | React dashboard (Recharts): overview, weather drivers, model quality, what-if simulator |
| `scripts/01_build_dataset.py` | Generates the dataset and fits both models |
| `scripts/02_refit_logistic.py` | Refits the logistic model, recomputes thresholds, calibration and coefficients |

## Dataset

8 regions with different climates (coastal, wildfire-wind, desert, urban, hurricane/thunderstorm, forest-ice, lake-snow, mountain snow-wind), daily from 2023-01-01 to 2025-12-31. 155 outage-event days (1.8% of rows).

| Column | Description |
|---|---|
| `date`, `region`, `climate_type`, `month` | Keys and seasonality |
| `temp_max_f`, `temp_min_f` | Daily temperature extremes |
| `wind_avg_mph`, `wind_gust_mph`, `prior_day_gust_mph` | Wind, including previous-day gust (weakened trees and lines) |
| `precip_in`, `snow_in`, `ice_accum_in` | Precipitation by type |
| `humidity_pct`, `lightning_strikes` | Atmospheric conditions |
| `soil_moisture_7d_in` | Trailing 7-day precipitation, a proxy for saturated soil and tree falls |
| `tree_canopy_pct`, `grid_age_index`, `underground_pct` | Static region attributes |
| `customers_served` | Customers in the region |
| **`outage_event`** | **Target:** 1 if a weather-driven outage event occurred |
| `customers_out`, `pct_customers_out` | Severity, 0 on non-event days |

## Method

- **Split by time:** train on 2023–24 (5,848 rows), test on 2025 (2,920 rows, 44 events). No random shuffling, so there is no leakage from future weather.
- **Primary model:** standardized logistic regression. Chosen because it beat gradient boosting on the holdout, it is interpretable, and the dashboard simulator can run the exact coefficients in the browser.
- **Comparison:** gradient boosting (200 trees, depth 3).

## Results (2025 holdout)

| Model | ROC AUC | Avg precision | Brier |
|---|---|---|---|
| Logistic regression | **0.892** | **0.469** | **0.0107** |
| Gradient boosting | 0.857 | 0.239 | 0.0165 |
| Base rate | | 0.015 | |

- The top 5% of days by predicted risk (146 days) contain **68%** of outages, a 20.5% hit rate against a 1.5% base rate.
- Wind gust is the strongest single driver, followed by canopy, minimum temperature, precipitation and snowfall.
- Days with more than 0.1 in of ice have an outage rate of about 43%, versus about 1.6% otherwise.

Alert threshold trade-off (logistic):

| Cutoff | Precision | Recall | Alert days |
|---|---|---|---|
| 10% | 24% | 64% | 116 |
| 20% | 42% | 59% | 62 |
| 30% | 44% | 50% | 50 |
| 50% | 68% | 34% | 22 |

## Running the dashboard

`outage_dashboard.jsx` is a single-file component with a default export and the model outputs embedded. It needs `react` and `recharts`:

```bash
npm create vite@latest outage-ui -- --template react
cd outage-ui && npm install recharts
# copy outage_dashboard.jsx into src/, then in src/main.jsx:
#   import Dashboard from "./outage_dashboard.jsx"  and render <Dashboard />
npm run dev
```

It also drops straight into a Claude artifact or CodeSandbox.

## Reproducing

```bash
pip install numpy pandas scikit-learn
python scripts/01_build_dataset.py   # writes dataset + summary.json
python scripts/02_refit_logistic.py  # run from the same folder as the CSV
```

The dashboard's embedded numbers come from `summary.json`; re-embed it if you change the data.

## Limitations

- **Synthetic data.** Results show the method works on data with this structure, not that it would on a real utility's records.
- **Small event count.** 44 test events means metrics move noticeably with a different seed or split, and the calibration bins above 5% each hold only dozens of days.
- **Calibration.** The model over-predicts in the 5–20% range and is reasonable above 20%. Recalibrate (isotonic or Platt) before using probabilities at face value.
- **Logistic beating GBM** is partly an artifact of the simulation being close to logistic. Real outage data, with interactions and vegetation effects, may reverse this.
- **Daily, region-level granularity.** Real outages are local (feeder, circuit); this predicts regional event days only.

## Where to take it with real data

Replace the CSV with utility outage logs (for example EIA-417 disturbance reports or public utility outage feeds, depending on region) joined to NOAA/ASOS or GHCN daily weather and a regional vegetation layer. The column names are chosen so the same scripts and dashboard work after the swap.
