from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base

class DeviceData(Base):
    __tablename__ = "device_data"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, index=True)
    temperature = Column(Float)
    humidity = Column(Float)
    vibration = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())