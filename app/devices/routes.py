from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.device_data import DeviceData
from datetime import datetime
from app.utils.security import require_admin

router = APIRouter(prefix="/devices", tags=["Devices"])

@router.get("/{device_id}/latest")
def latest_data(device_id: str, limit: int = 20, db: Session = Depends(get_db)):
    data = (
        db.query(DeviceData)
        .filter(DeviceData.device_id == device_id)
        .order_by(DeviceData.timestamp.desc())
        .limit(limit)
        .all()
    )
    return data
@router.get("/{device_id}/range")
def range_data(
    device_id: str,
    start: datetime,
    end: datetime,
    db: Session = Depends(get_db)
):
    return (
        db.query(DeviceData)
        .filter(
            DeviceData.device_id == device_id,
            DeviceData.timestamp.between(start, end)
        )
        .all()
    )
router = APIRouter(prefix="/devices", tags=["Devices"])

@router.delete("/{device_id}")
def delete_device(device_id: str, user=Depends(require_admin)):
    return {"deleted": device_id}
@router.post("/{device_id}/control")
def send_control(device_id: str, payload: dict):

    
    {
      "pitch": 0.1,
      "roll": -0.2,
      "throttle": 45,
      "yaw": 50
    }
    print("CONTROL RECEIVED")
    print("Device:", device_id)
    print("Payload:", payload)
    return {
        "status": "received",
        "device_id": device_id,
        "payload": payload
    }