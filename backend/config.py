from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent  # folder backend/

SECRET_KEY = "sales-prediction-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

DUMMY_USERS = {
    "admin": {
        "username": "admin",
        "password": "admin123",
    }
}

# ⬇️ naik ke root project
ROOT_DIR = BASE_DIR.parent

DATA_PATH = ROOT_DIR / "data" / "sales_data.csv"
MODEL_PATH = ROOT_DIR / "ml" / "model.joblib"
