import json
from app.database.db import SessionLocal
from app.models.device_data import DeviceData

def on_message(client, userdata, msg):
    payload = json.loads(msg.payload.decode())
    topic = msg.topic
    device_id = topic.split("/")[2]

    db = SessionLocal()
    data = DeviceData(
        device_id=device_id,
        temperature=payload["temperature"],
        humidity=payload["humidity"],
        vibration=payload["vibration"]
    )
    db.add(data)
    db.commit()
    db.close()

    print("Saved to DB:", payload)