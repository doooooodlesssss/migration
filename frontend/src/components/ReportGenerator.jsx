import React, { useState } from 'react';
import '../styles/report-generator.css';
const ReportGenerator = () => {
  const [formData, setFormData] = useState({
    countries: [],
    years: [],
    reportType: 'hotspots',
    countryInput: '',
    yearInput: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addCountry = () => {
    if (formData.countryInput && !formData.countries.includes(formData.countryInput)) {
      setFormData({
        ...formData,
        countries: [...formData.countries, formData.countryInput],
        countryInput: ''
      });
    }
  };

  const addYear = () => {
    if (formData.yearInput && !formData.years.includes(parseInt(formData.yearInput))) {
      setFormData({
        ...formData,
        years: [...formData.years, parseInt(formData.yearInput)],
        yearInput: ''
      });
    }
  };

  const removeCountry = (country) => {
    setFormData({
      ...formData,
      countries: formData.countries.filter(c => c !== country)
    });
  };

  const removeYear = (year) => {
    setFormData({
      ...formData,
      years: formData.years.filter(y => y !== year)
    });
  };

  const generateReport = async () => {
    if (formData.countries.length === 0 || formData.years.length === 0) {
      alert('Please add at least one country and one year');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          countries: formData.countries,
          years: formData.years,
          report_type: formData.reportType
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.reportType}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-generator">
      <h2>Generate Custom Report</h2>
      
      <div className="form-section">
        <h3>Countries to Analyze</h3>
        <div className="input-group">
          <input
            type="text"
            name="countryInput"
            value={formData.countryInput}
            onChange={handleChange}
            placeholder="Enter country name"
          />
          <button type="button" onClick={addCountry}>Add</button>
        </div>
        
        {formData.countries.length > 0 && (
          <div className="selected-items">
            {formData.countries.map((country, i) => (
              <span key={i} className="item-tag">
                {country}
                <button onClick={() => removeCountry(country)}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="form-section">
        <h3>Years to Analyze</h3>
        <div className="input-group">
          <input
            type="number"
            name="yearInput"
            value={formData.yearInput}
            onChange={handleChange}
            placeholder="Enter year (e.g., 2020)"
            min="1950"
            max={new Date().getFullYear()}
          />
          <button type="button" onClick={addYear}>Add</button>
        </div>
        
        {formData.years.length > 0 && (
          <div className="selected-items">
            {formData.years.map((year, i) => (
              <span key={i} className="item-tag">
                {year}
                <button onClick={() => removeYear(year)}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="form-section">
        <h3>Report Type</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="reportType"
              value="hotspots"
              checked={formData.reportType === 'hotspots'}
              onChange={handleChange}
            />
            Hotspot Analysis
          </label>
          <label>
            <input
              type="radio"
              name="reportType"
              value="impact"
              checked={formData.reportType === 'impact'}
              onChange={handleChange}
            />
            Impact Analysis
          </label>
        </div>
      </div>
      
      <button 
        className="generate-btn"
        onClick={generateReport}
        disabled={loading || formData.countries.length === 0 || formData.years.length === 0}
      >
        {loading ? 'Generating...' : 'Generate PDF Report'}
      </button>
    </div>
  );
};

export default ReportGenerator;