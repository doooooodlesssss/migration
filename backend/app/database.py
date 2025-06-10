from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "migration_db"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_collection(collection_name):
    return db[collection_name]