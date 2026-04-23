from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, sales, predict

app = FastAPI(title="Sales Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(sales.router)
app.include_router(predict.router)


@app.get("/")
def root():
    return {"message": "API berjalan!"}
