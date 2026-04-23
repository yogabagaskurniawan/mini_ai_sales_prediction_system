from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import joblib, numpy as np, os
from auth_utils import verify_token
from config import MODEL_PATH

router = APIRouter()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILE = os.path.join(BASE_DIR, MODEL_PATH)

_model = None


def load_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_FILE):
            raise HTTPException(status_code=503, detail="Model belum di-train")
        _model = joblib.load(MODEL_FILE)
    return _model


class PredictRequest(BaseModel):
    jumlah_penjualan: float
    harga: float
    diskon: float


@router.post("/predict")
def predict(body: PredictRequest, _: str = Depends(verify_token)):
    model = load_model()
    features = np.array([[body.jumlah_penjualan, body.harga, body.diskon]])
    prediction = model.predict(features)[0]
    proba = model.predict_proba(features)[0]
    classes = model.classes_
    return {
        "status": str(prediction),
        "confidence": round(float(max(proba)), 4),
        "probabilities": {str(c): round(float(p), 4) for c, p in zip(classes, proba)},
    }
