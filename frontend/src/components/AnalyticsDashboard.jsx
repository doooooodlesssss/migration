import React, { useEffect, useState } from 'react';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import SankeyChart from './charts/SankeyChart';
import '../styles/dashboard.css';

const AnalyticsDashboard = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/analytics/summary');
        const data = await response.json();
        setSummaryData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!summaryData) return <div>No data available</div>;

  return (
    <div className="dashboard">
      <h2>Global Refugee Trends</h2>
      
      <div className="chart-row">
        <div className="chart-container">
          <h3>Refugees by Year</h3>
          <LineChart 
            data={summaryData.refugees_by_year.map(item => ({
              year: item._id,
              refugees: item.total_refugees
            }))} 
            xField="year" 
            yField="refugees"
          />
        </div>
      </div>
      
      <div className="chart-row">
        <div className="chart-container">
          <h3>Top Origin Countries</h3>
          <PieChart 
            data={summaryData.top_origins.map(item => ({
              name: item._id,
              value: item.total_refugees
            }))}
          />
        </div>
        
        <div className="chart-container">
          <h3>Top Asylum Countries</h3>
          <PieChart 
            data={summaryData.top_asylums.map(item => ({
              name: item._id,
              value: item.total_refugees
            }))}
          />
        </div>
      </div>
      
      <div className="chart-row">
        <div className="chart-container">
          <h3>Refugee Flows</h3>
          // In your AnalyticsDashboard.jsx, modify the SankeyChart usage:
        <SankeyChart 
  data={[
    ...summaryData.top_origins.map(origin => ({
      source: origin._id,
      target: "Global",
      value: origin.total_refugees
    })),
    ...summaryData.top_asylums.map(asylum => ({
      source: "Global",
      target: asylum._id,
      value: asylum.total_refugees
    }))
  ]}
  width={800}
  height={500}
        />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;