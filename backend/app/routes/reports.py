from fastapi import APIRouter, HTTPException
from app.models.migration import ReportRequest
from app.services.google_ai import generate_hotspot_analysis, generate_impact_report
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from io import BytesIO
from fastapi.responses import StreamingResponse

router = APIRouter()

def generate_pdf(content, title):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    
    # Add title
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(72, 750, title)
    
    # Add content
    pdf.setFont("Helvetica", 12)
    y_position = 700
    for line in content.split('\n'):
        if y_position < 50:
            pdf.showPage()
            y_position = 750
        pdf.drawString(72, y_position, line)
        y_position -= 15
    
    pdf.save()
    buffer.seek(0)
    return buffer

@router.post("/reports/generate")
async def generate_report(request: ReportRequest):
    try:
        print("Report request:", request.dict())  # Debug log
        
        if not request.countries or not request.years:
            raise HTTPException(status_code=400, detail="Countries and years are required")
        
        if request.report_type not in ["hotspots", "impact"]:
            raise HTTPException(status_code=400, detail="Invalid report type")
        
        # Generate report content
        if request.report_type == "hotspots":
            content = generate_hotspot_analysis(request.countries, request.years)
            title = "Hotspot Analysis Report"
        else:
            content = generate_impact_report(request.countries, request.years)
            title = "Impact Analysis Report"
        
        # Generate PDF
        pdf_buffer = generate_pdf(content, title)
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={title.replace(' ', '_')}.pdf"
            }
        )
    except Exception as e:
        print("Report generation error:", str(e))  # Debug log
        raise HTTPException(status_code=500, detail=str(e))