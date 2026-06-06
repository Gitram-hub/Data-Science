
# DataVision — Backend

Flask backend for DataVision. Entry point: `app.py`. It provides simple user management (SQLite `users.db`), endpoints for dataset upload, exploratory summaries, correlation plotting (returns base64 PNGs), model training, and prediction.

Tech stack
- Python 3.8+
- Flask, Flask-CORS
- pandas, numpy, scikit-learn, matplotlib
- SQLite (users.db)

Run locally

```
cd DataVision/Backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

If you don't have a `requirements.txt`, create one with:

```
flask
flask-cors
pandas
numpy
scikit-learn
matplotlib
werkzeug

# optional for Excel support
openpyxl
```

API Endpoints (examples)
- `GET /` — health check

- `POST /signup` — register

Example:

```
curl -X POST http://localhost:5000/signup -H "Content-Type: application/json" -d '{"name":"Alice","email":"a@x.com","password":"secret"}'
```

- `POST /login` — login

```
curl -X POST http://localhost:5000/login -H "Content-Type: application/json" -d '{"email":"a@x.com","password":"secret"}'
```

- `POST /data` — upload dataset (multipart form)

```
curl -X POST http://localhost:5000/data -F "file=@/path/to/data.csv" -F "target=price"
```

- `GET /summary` — dataset summary
- `GET /correlation` — top correlated columns and scatter images

- `POST /train` — trains a regression model on uploaded dataset

- `POST /predict` — upload a test dataset and receive predictions

Notes
- The app stores the most recently uploaded dataset and trained model in memory (process scope). Restarting the server clears them.
- For production use, replace in-memory state with persistent storage and secure authentication.

