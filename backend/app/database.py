from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import certifi



load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "migration_db"

#client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
client = MongoClient(
    MONGO_URI,
    tlsCAFile=certifi.where()
)

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client[DB_NAME]
migration_collection = db["migration_data"]