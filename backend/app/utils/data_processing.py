import pandas as pd
from app.database import get_collection
from app.models.migration import MigrationData

def import_data_from_csv(file_path: str):
    collection = get_collection("migration_data")
    
    # Read CSV file
    df = pd.read_csv(file_path)
    
    # Clean and prepare data
    df = df.fillna(0)
    df.columns = [col.lower().replace(' ', '_') for col in df.columns]
    
    # Convert to list of dictionaries
    data = df.to_dict('records')
    
    # Insert into MongoDB
    if data:
        collection.insert_many(data)
        print(f"Inserted {len(data)} documents into MongoDB")
    else:
        print("No data to insert")
