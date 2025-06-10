import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import api from '../services/api';

const Dashboard = () => {
  const [topCountries, setTopCountries] = useState([]);
  const [globalTrends, setGlobalTrends] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get top countries for the latest year
        const currentYear = new Date().getFullYear() - 1;
        const countriesResponse = await api.get(`/api/analytics/top-countries/${currentYear}`);
        setTopCountries(countriesResponse.data);
        
        // Get global trends
        const trendsResponse = await api.get('/api/analytics/global-trends');
        setGlobalTrends(trendsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    fetchData();
  }, []);

  const topCountriesChartData = {
    labels: topCountries.map(item => item._id),
    datasets: [
      {
        label: 'Refugees',
        data: topCountries.map(item => item.total_refugees),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',

    },
    {
      label: 'Asylum Seekers',
      data: topCountries.map(item => item.total_asylum_seekers),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    }
  ]
};

const globalTrendsChartData = {
  labels: globalTrends.map(item => item.year),
  datasets: [
    {
      label: 'Global Refugees',
      data: globalTrends.map(item => item.refugees),
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false
    },
    {
      label: 'Global Asylum Seekers',
      data: globalTrends.map(item => item.asylum_seekers),
      borderColor: 'rgba(153, 102, 255, 1)',
      fill: false
    }
  ]
};

return (
  <div>
      <Typography variant="h4" gutterBottom>Global Migration Dashboard</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top Refugee Hosting Countries</Typography>
              <Bar data={topCountriesChartData} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Global Migration Trends</Typography>
              <Line data={globalTrendsChartData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
