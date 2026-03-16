import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import io, base64

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.ensemble import HistGradientBoostingRegressor

app = Flask(__name__)
CORS(app)

stored_df = None
stored_target = None
stored_transformer = None
stored_model = None
MAX_POINTS = 1000


@app.route("/data", methods=["POST"])
def upload():
    global stored_df, stored_target

    file = request.files["file"]
    target = request.form.get("target")
    filename = file.filename.lower()

    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(file)
        elif filename.endswith((".xlsx", ".xls")):
            df = pd.read_excel(file)
        elif filename.endswith(".json"):
            df = pd.read_json(file)
        else:
            return jsonify({"error": "Unsupported file"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    stored_df = df
    stored_target = target if target in df.columns else None

    return jsonify({
        "filename": file.filename,
        "target": stored_target,
        "rows": len(df),
        "columns": list(df.columns)
    })



@app.route("/summary")
def summary():
    if stored_df is None:
        return jsonify({"desc": {}})

    desc = stored_df.describe(include="all").fillna("").to_dict()
    return jsonify({"desc": desc})


# ---------------- CORRELATION + PREPROCESSOR ----------------
@app.route("/correlation")
def correlation():
    global stored_transformer

    if stored_df is None or stored_target is None:
        return jsonify({"top_correlated_columns": [], "graph_images": {}})

    df = stored_df.copy()

    X = df.drop(columns=[stored_target])
    y = df[stored_target]

    numeric_cols = X.select_dtypes(include=np.number).columns.tolist()
    cat_cols = X.select_dtypes(exclude=np.number).columns.tolist()

    stored_transformer = ColumnTransformer([
        ("num", StandardScaler(), numeric_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols)
    ])

    X_transformed = stored_transformer.fit_transform(X)

    feature_names = []
    if numeric_cols:
        feature_names.extend(numeric_cols)

    if cat_cols:
        ohe = stored_transformer.named_transformers_["cat"]
        feature_names.extend(ohe.get_feature_names_out(cat_cols))

    X_df = pd.DataFrame(X_transformed, columns=feature_names)

    if y.dtype == "object":
        from sklearn.preprocessing import LabelEncoder
        y = LabelEncoder().fit_transform(y)

    X_df[stored_target] = y

    corr = X_df.corr()[stored_target].drop(stored_target).abs()
    top_cols = corr.sort_values(ascending=False).head(9).index.tolist()

    graph_images = {}

    for col in top_cols:
        x = X_df[col].values
        y_vals = X_df[stored_target].values

        if len(x) > MAX_POINTS:
            idx = np.random.choice(len(x), MAX_POINTS, replace=False)
            x = x[idx]
            y_vals = y_vals[idx]

        fig, ax = plt.subplots(figsize=(5, 4))
        ax.scatter(x, y_vals, alpha=0.6)
        ax.set_xlabel(col)
        ax.set_ylabel(stored_target)
        ax.grid(True)

        buf = io.BytesIO()
        fig.savefig(buf, format="png", bbox_inches="tight")
        plt.close(fig)

        graph_images[col] = (
            "data:image/png;base64,"
            + base64.b64encode(buf.getvalue()).decode()
        )

    return jsonify({
        "top_correlated_columns": top_cols,
        "graph_images": graph_images
    })

# ---------------- TRAIN MODEL ----------------
@app.route("/train", methods=["POST"])
def train():
    global stored_df, stored_target, stored_transformer, stored_model

    if stored_df is None or stored_target is None:
        return jsonify({"error": "Upload dataset first"}), 400

    X = stored_df.drop(columns=[stored_target])
    y = stored_df[stored_target]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    
    pipeline = Pipeline([
        ("preprocess", stored_transformer),
        ("model", HistGradientBoostingRegressor())
    ])


    pipeline.fit(X_train, y_train)

    preds = pipeline.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, preds))

    stored_model = pipeline

    return jsonify({
        "message": "Model trained successfully",
        "rmse": float(rmse)
    })


# ---------------- PREDICT ----------------
@app.route("/predict", methods=["POST"])
def predict():
    global stored_model

    if stored_model is None:
        return jsonify({"error": "Train model first"}), 400

    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No test dataset uploaded"}), 400

    filename = file.filename.lower()

    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(file)
        elif filename.endswith((".xlsx", ".xls")):
            df = pd.read_excel(file)
        elif filename.endswith(".json"):
            df = pd.read_json(file)
        else:
            return jsonify({"error": "Unsupported file"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    preds = stored_model.predict(df)

    return jsonify({
        "predictions": preds.tolist()
    })


# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
