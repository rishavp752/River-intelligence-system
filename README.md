# RIVER INTELLIGENCE
**Environmental Technology Meets Artificial Intelligence**

*IoT- and AI-Based River Water Quality Monitoring with Heavy Metal Risk Prediction and Drone-Assisted Pollution Mapping*

---

## Academic Project Information
- **Institution:** Asansol Engineering College
- **Department:** Computer Science and Engineering
- **Academic Session:** 2026–2027
- **Group Number:** 4
- **Team Members (5 Members):**
  - **139** — Rijoy Biswas
  - **140** — Rishabh Kumar Shaw
  - **141** — Rishan Nandi
  - **142** — Rishav Kumar Pandey
  - **144** — Ritik Kumar Ram

---

## 1. What RIVER INTELLIGENCE Does
**RIVER INTELLIGENCE** is a self-contained, cross-platform, installable Progressive Web Application (PWA) demonstrating an integrated environmental monitoring framework for rivers:
1. **Overview Command Centre:** Interactive SVG river corridor displaying Upstream Reference (Station A), Midstream Influx (Station B — Flagged), and Downstream Recovery (Station C), KPI telemetry, cross-station comparison charts, and preliminary risk classification.
2. **Live Monitoring Module:** Interactive station cards pre-loaded with the project baseline dataset (`pH`, `Temperature`, `Turbidity`, `Dissolved Oxygen`, and `Electrical Conductivity`) and a live simulation controller (Start, Pause, Resume, Reset to Baseline, Speed Multiplier, Single-Step Demo Reading, and Manual Overrides).
3. **Water Analytics Module:** Five dedicated interactive time-series and station comparison charts across all 5 parameters with configurable demonstration reference lines and scientific parameter briefs.
4. **AI Risk Assessment Module:** Visualizes the 6-stage ML pipeline (*Dataset → Preprocessing → Feature Selection → Model Training → Model Evaluation → Prediction*), compares Decision Tree, Random Forest, and Logistic Regression classifiers, explains Accuracy, Precision, Recall, and F1-Score, and provides a transparent rule-based preliminary risk engine with a What-If sandbox.
5. **Heavy Metal Analysis Module:** Evaluates Lead (`Pb`), Mercury (`Hg`), Arsenic (`As`), and Cadmium (`Cd`), clearly distinguishing between **PREDICTED RISK** (preliminary ML-based estimate awaiting labelled datasets) and **LAB CONFIRMED** (laboratory chemical analysis such as ICP-MS / AAS).
6. **GIS Pollution Map Module:** Multi-layer interactive SVG river map with 5 toggleable layers (River Route, Monitoring Stations, Potential Hotspots, Illustrative Heatmap, and Drone Observations) and detailed station/hotspot inspection panels.
7. **Drone Intelligence Module:** Supports local aerial image file upload (`<input type="file">`), pre-loaded sample aerial river frames, click-to-annotate hotspot pins on the image canvas, visible pollution category tagging, and Station A/B/C geo-association.
8. **Alerts & Reports Module:** Displays the Station B multi-parameter anomaly alert with station/severity filtering, acknowledgement controls, one-click **CSV Report Export**, and **Printable Monitoring Summary**.
9. **System Architecture Module:** Dual-track interactive architecture diagram illustrating the IoT/ML pipeline and parallel Drone-Assisted GIS track.
10. **About Project & Download Package Center:** Complete academic documentation, research gap analysis, scientific limitations, future scope, and one-click source code ZIP download.

---

## 2. Required Software (For Running Locally on Laptop/PC)
- **Node.js:** v18.0.0 or higher (LTS recommended) — [https://nodejs.org](https://nodejs.org)
- **npm:** v9.0.0 or higher (included with Node.js)
- **Modern Web Browser:** Google Chrome, Brave, Microsoft Edge, or Firefox

---

## 3. How to Install Dependencies & Run Locally

Extract the project folder on your computer, open a terminal (Command Prompt, PowerShell, or Terminal) inside the project directory, and run:

```bash
# Step 1: Install all required npm packages
npm install

# Step 2: Start the local development server (runs on http://localhost:3000)
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 4. How to Build & Preview the Production Version

To compile the optimized production bundle (including the compiled Service Worker and Web App Manifest):

```bash
# Step 1: Build the production bundle into the dist/ directory
npm run build

# Step 2: Start a local production preview server
npm run preview
```

Open the local preview URL displayed in your terminal (typically `http://localhost:4173`) to test the production build and service worker offline caching.

---

## 5. How to Install as an App (PWA)

### A. Installing on an Android Smartphone (Chrome or Brave)
1. Open the deployed application URL in **Google Chrome** or **Brave Browser** on your Android phone (ensure it is opened directly as a full tab, not inside an embedded preview iframe).
2. Tap the **Install App** button inside the top navigation bar of RIVER INTELLIGENCE, **OR** tap the browser menu icon (**⋮**) in the top-right corner and select **"Install app"** / **"Add to Home screen"**.
3. Confirm the prompt. **RIVER INTELLIGENCE** will be added to your Android app drawer and home screen with its custom icon and will launch in standalone full-screen window mode without a browser address bar.

### B. Installing on a Windows Laptop / Desktop (Chrome, Brave, or Edge)
1. Open the application URL (or `http://localhost:3000` / `http://localhost:4173` when running locally) in a dedicated browser tab in **Google Chrome**, **Brave**, or **Microsoft Edge**.
2. Click the **"Install App"** button in the top navigation bar, **OR** click the **Install icon** (monitor with a down arrow) on the right side of the browser address bar.
3. Click **Install**. The application will open in its own standalone desktop window and can be launched directly from the Windows Start Menu, Desktop shortcut, or Taskbar.

---

## 6. How to Use Offline Mode & Browser Limitations
- **How Offline Caching Works:** On your first visit, the Service Worker precaches the application shell, JavaScript/CSS bundles, custom SVG/PNG icons, sample aerial drone images, and offline fallback page (`/offline.html`).
- **Offline Capabilities:** Once cached, you can disconnect from Wi-Fi/mobile data and continue using the simulated IoT telemetry, live simulation controller, Recharts water analytics, rule-based risk engine, interactive SVG GIS map, manual drone image annotation (using local device files or cached samples), and local CSV export. User modifications are saved in browser `localStorage`.
- **Browser-Specific Limitations:**
  - The automatic `beforeinstallprompt` button is supported on Chromium-based browsers (Chrome, Brave, Edge, Opera) on Android and Windows/macOS/Linux when opened in a top-level browser tab.
  - Browsers block native install prompts inside sandboxed `<iframe>` previews (such as the split-screen AI Studio preview pane); open the app URL in a new browser tab to trigger native installation.
  - Firefox Desktop and Safari macOS/iOS do not implement `beforeinstallprompt`; on iOS Safari, use **Share → Add to Home Screen**.

---

## 7. Scientific & Prototype Limitations
- **Simulated Sensor Data:** All readings for Station A, Station B, and Station C are simulated for academic demonstration and do not represent real-time physical river measurements.
- **Rule-Based Preliminary Risk Engine:** The risk classifier uses transparent demonstration rules rather than a trained machine learning model. Actual ML validation requires a suitable labelled dataset and independent testing.
- **Heavy Metal Assay Limitation:** Basic physico-chemical sensors (`pH`, `Temperature`, `Turbidity`, `Dissolved Oxygen`, `Electrical Conductivity`) and aerial drone imagery cannot directly measure dissolved heavy metals (`Pb`, `Hg`, `As`, `Cd`). Quantitative confirmation requires laboratory chemical spectroscopy (`ICP-MS` / `AAS`).
- **Zero External Cloud / Zero Cost:** This application uses no Firebase, no external databases, no API keys, and no paid cloud services.
