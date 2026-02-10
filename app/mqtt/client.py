import paho.mqtt.client as mqtt
from app.mqtt.handlers import on_message
from app.config import settings

def start_mqtt():
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(settings.MQTT_BROKER, settings.MQTT_PORT)
    client.subscribe("unimount/device/+/data")
    client.loop_start()