import React, { useState } from 'react';
import '../styles/pattern-search.css';

const PatternSearch = () => {
  const [formData, setFormData] = useState({
    country: '',
    startYear: 2010,
    endYear: new Date().getFullYear(),
    minRefugees: 1000
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/search/patterns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country_of_origin: formData.country,
          year_range: [parseInt(formData.startYear), parseInt(formData.endYear)],
          min_refugees: parseInt(formData.minRefugees)
        }),
      });
      
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Error searching patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pattern-search">
      <h2>Find Similar Migration Patterns</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Country of Origin:</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Start Year:</label>
            <input
              type="number"
              name="startYear"
              value={formData.startYear}
              onChange={handleChange}
              min="1950"
              max={new Date().getFullYear()}
              required
            />
          </div>
          
          <div className="form-group">
            <label>End Year:</label>
            <input
              type="number"
              name="endYear"
              value={formData.endYear}
              onChange={handleChange}
              min="1950"
              max={new Date().getFullYear()}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Minimum Refugee Count:</label>
          <input
            type="number"
            name="minRefugees"
            value={formData.minRefugees}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Patterns'}
        </button>
      </form>
      
      {results.length > 0 && (
        <div className="results">
          <h3>Similar Patterns Found:</h3>
          <table>
            <thead>
              <tr>
                <th>Country</th>
                <th>Year</th>
                <th>Refugees</th>
                <th>Asylum Seekers</th>
                <th>Similarity</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, i) => (
                <tr key={i}>
                  <td>{result.country_of_origin}</td>
                  <td>{result.year}</td>
                  <td>{Math.round(result.refugees)}</td>
                  <td>{Math.round(result.asylum_seekers)}</td>
                  <td>{(result.similarity * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatternSearch;