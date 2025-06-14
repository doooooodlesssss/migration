import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
from app.database import migration_collection
import pandas as pd

def preprocess_data():
    data = list(migration_collection.find({}))
    df = pd.DataFrame(data)
    
    # Normalize numerical features
    numerical_cols = ['refugees', 'returned_refugees', 'asylum_seekers', 'idps', 'returned_idps']
    df[numerical_cols] = df[numerical_cols].fillna(0)
    
    scaler = StandardScaler()
    df[numerical_cols] = scaler.fit_transform(df[numerical_cols])
    
    return df

def find_similar_patterns(target_country, year_range, min_refugees=1000, top_n=5):
    df = preprocess_data()
    
    # Filter target data
    target_data = df[
        (df['country_of_origin'] == target_country) & 
        (df['year'].between(year_range[0], year_range[1])) &
        (df['refugees'] >= min_refugees)
    ]
    
    if target_data.empty:
        return []
    
    # Get features for similarity calculation
    features = ['refugees', 'returned_refugees', 'asylum_seekers', 'idps']
    target_features = target_data[features].mean().values.reshape(1, -1)
    
    # Calculate similarity with all other records
    other_data = df[df['country_of_origin'] != target_country]
    other_features = other_data[features].values
    
    similarities = cosine_similarity(target_features, other_features)[0]
    other_data['similarity'] = similarities
    
    # Get top similar patterns
    similar_patterns = other_data.sort_values('similarity', ascending=False).head(top_n)
    
    return similar_patterns.to_dict('records')