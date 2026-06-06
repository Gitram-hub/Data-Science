
# DataVision

DataVision is a lightweight data analysis and prediction web application with a Python (Flask) backend and a React + Vite frontend. It is designed for quickly uploading tabular datasets, exploring correlations and summaries, training a simple model, and running predictions.

Features
- User signup / login (simple SQLite-backed auth).
- Upload CSV/Excel/JSON datasets and inspect summaries.
- Correlation analysis with scatter plots (returned as base64 PNGs).
- Train a scikit-learn regression model and return RMSE.
- Run predictions on new datasets.

Architecture
- Backend: Flask app exposing REST endpoints (see `Backend/app.py`).
- Frontend: React + Vite app under `frontend/` that consumes the backend APIs.

Backend endpoints (summary)
- `GET /` — health check.
- `POST /signup` — register a new user.
- `POST /login` — authenticate.
- `POST /data` — upload dataset (multipart file + `target` form field).
- `GET /summary` — dataset descriptive statistics.
- `GET /correlation` — top correlated columns + scatter images.
- `POST /train` — train model on uploaded data.
- `POST /predict` — predict on uploaded test dataset.

Frontend pages
- Home, Analysis, Predict, Scatter, Login, Logout, Signup, About (see `frontend/src/pages`).

Quick start

1) Backend

```
cd DataVision/Backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt  # create one if needed
python app.py
```

Backend runs by default on port `5000` and enables CORS for local development.

2) Frontend

```
cd DataVision/frontend
npm install
npm run dev
```

The frontend dev server uses Vite and runs on a different port (e.g. `5173`). Configure the frontend to call the backend at `http://localhost:5000`.

Contributing
- Open an issue or suggest enhancements. I can add `requirements.txt` or CI config if you want.

License
- Add a license file here if you plan to open-source the project.
