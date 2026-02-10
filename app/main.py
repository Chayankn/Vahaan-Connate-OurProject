from fastapi import FastAPI
from app.auth.routes import router as auth_router
from app.devices.routes import router as device_router
from app.mqtt.client import start_mqtt
from app.database.db import init_db


app = FastAPI(title="Unimount IoT Backend")

app.include_router(auth_router)
app.include_router(device_router)

@app.on_event("startup")
def startup():
    init_db()
    start_mqtt()

@app.get("/")
def root():
    return {"status": "Unimount backend running"}