from pydantic import BaseModel

class DeviceCreate(BaseModel):
    device_id: str

class DeviceOut(BaseModel):
    device_id: str
    status: str