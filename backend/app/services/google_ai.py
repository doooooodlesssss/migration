import google.generativeai as genai
import os
from dotenv import load_dotenv
from app.database import migration_collection
import pandas as pd

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_AI_KEY"))

def generate_report_text(prompt):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(prompt)
    return response.text

def generate_hotspot_analysis(countries, years):
    query = {
        "country_of_origin": {"$in": countries},
        "year": {"$in": years}
    }
    data = list(migration_collection.find(query))
    df = pd.DataFrame(data)
    
    summary = df.groupby(['country_of_origin', 'year']).agg({
        'refugees': 'sum',
        'asylum_seekers': 'sum'
    }).reset_index().to_string()
    
    prompt = f"""
    Analyze the following refugee and asylum seeker data to identify potential future hotspots.
    Provide insights on trends, potential causes, and recommendations for preparedness.
    
    Data Summary:
    {summary}
    
    Analysis:
    """
    
    return generate_report_text(prompt)

def generate_impact_report(countries, years):
    query = {
        "country_of_origin": {"$in": countries},
        "year": {"$in": years}
    }
    data = list(migration_collection.find(query))
    df = pd.DataFrame(data)
    
    summary = df.groupby(['country_of_origin', 'country_of_asylum', 'year']).agg({
        'refugees': 'sum'
    }).reset_index().to_string()
    
    prompt = f"""
    Analyze the impact of refugee movements based on the following data.
    Focus on the economic, social, and political impacts on both origin and asylum countries.
    Provide recommendations for policy makers and humanitarian organizations.
    
    Data Summary:
    {summary}
    
    Analysis:
    """
    
    return generate_report_text(prompt)