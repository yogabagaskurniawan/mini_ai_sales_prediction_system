from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
import pandas as pd
import os
from auth_utils import verify_token
from config import DATA_PATH

router = APIRouter()

# print("Loading data from:", DATA_PATH)


@router.get("/sales")
def get_sales(
    page: int = Query(1),
    limit: int = Query(20),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    _: str = Depends(verify_token),
):
    df = pd.read_csv(DATA_PATH)

    if status in ["Laris", "Tidak"]:
        df = df[df["status"] == status]
    if search:
        df = df[df["product_name"].str.contains(search, case=False, na=False)]

    total = len(df)
    start = (page - 1) * limit
    paginated = df.iloc[start : start + limit]

    full = pd.read_csv(DATA_PATH)
    summary = {
        "total_produk": len(full),
        "total_laris": int((full["status"] == "Laris").sum()),
        "total_tidak": int((full["status"] == "Tidak").sum()),
        "avg_penjualan": round(float(full["jumlah_penjualan"].mean()), 2),
    }

    return {
        "data": paginated.to_dict(orient="records"),
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": (total + limit - 1) // limit,
        },
        "summary": summary,
    }
