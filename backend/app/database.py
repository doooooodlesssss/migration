from pymongo import MongoClient
from dotenv import load_dotenv
import os
import csv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "migration_db"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_collection(collection_name):
    return db[collection_name]

def import_data_from_csv(file_path, collection_name):
    """
    Imports data from a CSV file to the specified MongoDB collection.
    
    :param file_path: Path to the CSV file.
    :param collection_name: Name of the MongoDB collection.
    """
    collection = get_collection(collection_name)
    with open(file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        data = list(reader)
        if data:
            collection.insert_many(data)
