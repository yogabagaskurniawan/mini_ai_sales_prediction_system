# 🤖 Mini AI Sales Prediction System

Sistem prediksi status produk **(Laris / Tidak Laris)** berbasis Machine Learning, dibangun sebagai Fullstack Technical Test dengan stack React JS, FastAPI, dan Scikit-learn.

---

## 📐 1. System Design

### Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER (User)                           │
│                                                             │
│              React JS + Tailwind CSS                        │
│     ┌──────────┐   ┌─────────────┐   ┌─────────────────┐    │
│     │  Login   │   │ Sales Table │   │  Predict Form   │    │
│     │   Page   │   │ + Pagination│   │  + AI Result    │    │
│     └──────────┘   └─────────────┘   └─────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP REST API
                           │ Authorization: Bearer <JWT>
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND  (Python / FastAPI)                │
│                                                             │
│   POST /login    →  Validasi dummy user  →  Return JWT      │
│   GET  /sales    →  Baca CSV  →  Filter & Paginate          │
│   POST /predict  →  Load model  →  Return prediksi          │
│                                                             │
│   ┌──────────────────────────────────────────────────────┐  │
│   │              ML Module (Scikit-learn)                │  │
│   │   RandomForestClassifier  ──►  model.joblib          │  │
│   │   Input: jumlah_penjualan, harga, diskon             │  │
│   │   Output: Laris / Tidak  +  confidence score         │  │
│   └──────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                  data/sales_data.csv
                  (5.000 baris data produk)
```

### Alur Data

1. **Login** — User kirim `username` + `password` → Backend validasi → Return JWT token
2. **Lihat Data** — Frontend kirim `GET /sales` dengan token → Backend baca CSV → Return data JSON (dengan pagination & filter)
3. **Prediksi** — User isi form → Frontend kirim `POST /predict` → Backend load `model.joblib` → Model prediksi → Return status + confidence
4. **Keamanan** — Setiap request ke `/sales` dan `/predict` wajib sertakan JWT di header. Token expired otomatis logout.

---

## 📁 Struktur Project

```
mini_ai_sales_prediction_system/
├── backend/
│   ├── main.py              # Entry point FastAPI
│   ├── config.py            # Konfigurasi global (secret key, path, dummy user)
│   ├── auth_utils.py        # JWT: create & verify token
│   ├── requirements.txt     # Dependency Python
│   └── routers/
│       ├── __init__.py
│       ├── auth.py          # POST /login
│       ├── sales.py         # GET /sales, GET /sales/{id}
│       └── predict.py       # POST /predict
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx                   # Router + PrivateRoute / PublicRoute
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global state autentikasi
│   │   ├── services/
│   │   │   └── api.js                # Axios instance + interceptors JWT
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   └── components/
│   │       ├── SalesTable.jsx        # Tabel + pagination + filter + search
│   │       └── PredictForm.jsx       # Form prediksi + hasil AI
│   ├── package.json
├── ml/
│   ├── train.py             # Script training model ML
│   └── model.joblib         # Model tersimpan (hasil training)
├── data/
│   └── sales_data.csv       # Dataset 5.000 produk
├── .gitignore
└── README.md
```

---

## ⚙️ Cara Menjalankan Project

### Prasyarat

Pastikan sudah terinstall:
- **Python** 3.9+ → https://python.org/downloads
- **Node.js** 18+ → https://nodejs.org
- **Git** → https://git-scm.com

### Clone Repository

```bash
git clone https://github.com/yogabagaskurniawan/mini_ai_sales_prediction_system.git
cd mini_ai_sales_prediction_system
```

---

### Langkah 1 — Training Model ML (wajib sebelum backend)

```bash
# Buat virtual environment
python -m venv venv

# Aktifkan (Windows)
venv\Scripts\activate

# Aktifkan (Mac/Linux)
source venv/bin/activate

# Install dependency
pip install -r backend/requirements.txt

# Jalankan training
python ml/train.py
```

Output yang diharapkan:
```
📂 Memuat data... Total: 5000 baris
🏋️  Training Random Forest Classifier...
📈 Accuracy: 1.0000 (100.00%)
✅ Model disimpan ke ml/model.joblib
```

---

### Langkah 2 — Jalankan Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

Backend berjalan di: **http://localhost:8000**

📄 Swagger API Docs: **http://localhost:8000/docs**

---

### Langkah 3 — Jalankan Frontend

Buka **terminal baru**, lalu:

```bash
cd frontend
npm install
npm start
```

Frontend berjalan di: **http://localhost:3000**

---

### Langkah 4 — Login ke Aplikasi

Buka browser → http://localhost:3000

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `admin123` |

---

## 📡 API Documentation

Dokumentasi interaktif tersedia di Swagger UI: **http://localhost:8000/docs**

### Endpoints

| Method | Endpoint      | Auth | Deskripsi                              |
|--------|---------------|------|----------------------------------------|
| POST   | `/login`      | ❌   | Login, return JWT access token         |
| GET    | `/sales`      | ✅   | List data penjualan (pagination, filter, search) |
| GET    | `/sales/{id}` | ✅   | Detail satu produk                     |
| POST   | `/predict`    | ✅   | Prediksi status produk via ML          |

### Contoh: POST `/login`

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "username": "admin"
}
```

---

### Contoh: GET `/sales`

**Query Parameters:**

| Parameter | Type   | Default | Keterangan                  |
|-----------|--------|---------|-----------------------------|
| page      | int    | 1       | Nomor halaman               |
| limit     | int    | 20      | Jumlah data per halaman     |
| status    | string | -       | Filter: `Laris` / `Tidak`   |
| search    | string | -       | Cari berdasarkan nama produk|

**Response:**
```json
{
  "data": [
    {
      "product_id": "P00001",
      "product_name": "Produk 1",
      "jumlah_penjualan": 57,
      "harga": 26556,
      "diskon": 25,
      "status": "Tidak"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5000,
    "total_pages": 250
  },
  "summary": {
    "total_produk": 5000,
    "total_laris": 3608,
    "total_tidak": 1392,
    "avg_penjualan": 152.3
  }
}
```

---

### Contoh: POST `/predict`

**Request:**
```json
{
  "jumlah_penjualan": 200,
  "harga": 75000,
  "diskon": 10
}
```

**Response:**
```json
{
  "status": "Laris",
  "confidence": 0.98,
  "probabilities": {
    "Laris": 0.98,
    "Tidak": 0.02
  }
}
```

---

## 🤖 Machine Learning

### Problem
Binary Classification: memprediksi apakah sebuah produk **Laris** atau **Tidak Laris**.

### Model
**Random Forest Classifier** dipilih karena:
- Robust terhadap fitur dengan skala berbeda (tidak perlu normalisasi)
- Memberikan feature importance yang informatif
- Akurasi tinggi dengan sedikit tuning

### Fitur Input

| Fitur             | Tipe  | Keterangan              |
|-------------------|-------|-------------------------|
| jumlah_penjualan  | float | Jumlah unit terjual     |
| harga             | float | Harga satuan (Rupiah)   |
| diskon            | float | Persentase diskon (0-100)|

### Hasil Evaluasi

| Metrik           | Nilai  |
|------------------|--------|
| Accuracy         | 100%   |
| Cross-Val (5-fold)| 1.0 ± 0.0 |
| Precision Laris  | 1.00   |
| Recall Laris     | 1.00   |
| Precision Tidak  | 1.00   |
| Recall Tidak     | 1.00   |

### Feature Importance

```
jumlah_penjualan  : 98.64%  ████████████████████████████████████████
harga             :  1.16%  
diskon            :  0.20%  
```

> Catatan: Accuracy 100% menunjukkan bahwa label `Laris/Tidak` dalam dataset ini sangat ditentukan oleh `jumlah_penjualan`. Produk dengan penjualan tinggi konsisten berlabel Laris dan sebaliknya — polanya sangat linear dan jelas.

---

## 🛠️ Tech Stack

| Layer    | Teknologi                                      |
|----------|------------------------------------------------|
| Frontend | React JS 18, React Router v6, Axios, Tailwind CSS |
| Backend  | Python, FastAPI, Uvicorn, Pydantic             |
| Auth     | JWT (python-jose)                              |
| ML       | Scikit-learn, Pandas, NumPy, Joblib            |
| Dataset  | CSV (5.000 baris)                              |

---

## 🖼️ Screenshot UI

### Halaman Login
Autentikasi dengan dummy user. Token JWT disimpan di `localStorage` setelah login berhasil.

![Preview NFT Display & Send](https://github.com/yogabagaskurniawan/mini_ai_sales_prediction_system/blob/main/preview/screen-login.png)

---

### Dashboard — Data Penjualan
Menampilkan ringkasan statistik (total produk, produk laris, tidak laris, rata-rata terjual) dan tabel data dengan fitur search, filter status, dan pagination server-side.

![Preview NFT Display & Send](https://github.com/yogabagaskurniawan/mini_ai_sales_prediction_system/blob/main/preview/screen-dashboard-tabel.png)

---

### Dashboard — Prediksi AI
Form input data produk (jumlah terjual, harga, diskon) yang langsung terhubung ke endpoint `POST /predict`. Hasil prediksi ditampilkan beserta confidence score dari model.

![Preview NFT Display & Send](https://github.com/yogabagaskurniawan/mini_ai_sales_prediction_system/blob/main/preview/screen-dashboard-prediksi.png)
