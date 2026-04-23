import pandas as pd
import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# --- 1. Baca data CSV ---
df = pd.read_csv("data/sales_data.csv")
print(f"Data dimuat: {len(df)} baris")

# --- 2. Pilih kolom input dan target ---
X = df[["jumlah_penjualan", "harga", "diskon"]]  # fitur/input
y = df["status"]  # target/output

# --- 3. Bagi data: 80% latih, 20% uji ---
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# --- 4. Buat dan latih model ---
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# --- 5. Evaluasi model ---
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred))

# --- 6. Simpan model ---
joblib.dump(model, "ml/model.joblib")
print("Model disimpan ke ml/model.joblib")
