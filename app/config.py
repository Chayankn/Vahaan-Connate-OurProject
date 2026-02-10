from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    MQTT_BROKER: str
    MQTT_PORT: int
    JWT_SECRET: str   # ✅ REQUIRED

    class Config:
        env_file = ".env"

settings = Settings()