from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.database import get_collection
from google.cloud import aiplatform
import os
import pandas as pd
import tempfile
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

router = APIRouter()

# Initialize Google AI
aiplatform.init(project=os.getenv("GCP_PROJECT_ID"))

def generate_pdf_report(data, filename):
    doc = SimpleDocTemplate(filename, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    story.append(Paragraph("Migration & Refugee Report", styles['Title']))
    story.append(Spacer(1, 12))
    
    # Summary
    story.append(Paragraph("Summary Statistics", styles['Heading2']))
    
    # Create summary table
    summary_data = [
        ["Metric", "Value"],
        ["Total Refugees", data.get('total_refugees', 0)],
        ["Total Asylum Seekers", data.get('total_asylum_seekers', 0)],
        ["Total IDPs", data.get('total_idps', 0)],
        ["Top Origin Country", data.get('top_origin', "N/A")],
        ["Predicted Hotspot", data.get('is_hotspot', False)]
    ]
    
    table = Table(summary_data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    story.append(table)
    story.append(Spacer(1, 12))
    
    # Trends
    story.append(Paragraph("Trend Analysis", styles['Heading2']))
    
    if 'trends' in data:
        trend_data = [["Year", "Refugees", "Asylum Seekers", "IDPs"]]
        for trend in data['trends']:
            trend_data.append([
                trend['year'],
                trend['refugees'],
                trend['asylum_seekers'],
                trend['idps']
            ])
        
        trend_table = Table(trend_data)
        trend_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(trend_table)
    
    doc.build(story)

@router.get("/reports/generate/{country_iso}")
async def generate_report(country_iso: str):
    collection = get_collection("migration_data")
    
    # Get data for the country
    query = {"country_of_asylum_iso": country_iso}
    results = list(collection.find(query, {"_id": 0}))
    
    if not results:
        raise HTTPException(status_code=404, detail="Country not found")
    
    # Convert to DataFrame for analysis
    df = pd.DataFrame(results)
    
    # Calculate summary statistics
    summary = {
        'total_refugees': df['refugees'].sum(),
        'total_asylum_seekers': df['asylum_seekers'].sum(),
        'total_idps': df['idps'].sum(),
        'top_origin': df.groupby('country_of_origin')['refugees'].sum().idxmax(),
        'trends': df.groupby('year').agg({
            'refugees': 'sum',
            'asylum_seekers': 'sum',
            'idps': 'sum'
        }).reset_index().to_dict('records')
    }
    
    # Use Google AI to predict hotspot
    endpoint = aiplatform.Endpoint(
        endpoint_name=f"projects/{os.getenv('GCP_PROJECT_ID')}/locations/us-central1/endpoints/migration-hotspot-predictor"
    )
    
    # Prepare input for prediction
    input_data = {
        "country_iso": country_iso,
        "refugee_count": summary['total_refugees'],
        "asylum_seeker_count": summary['total_asylum_seekers'],
        "idp_count": summary['total_idps']
    }
    
    prediction = endpoint.predict(instances=[input_data])
    summary['is_hotspot'] = prediction.predictions[0]['hotspot']
    
    # Generate PDF report
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        generate_pdf_report(summary, temp_file.name)
        temp_file.close()
        return FileResponse(temp_file.name, filename=f"migration_report_{country_iso}.pdf")
