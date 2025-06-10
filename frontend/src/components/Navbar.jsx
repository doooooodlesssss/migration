import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Migration Insights
        </Typography>
        <Button color="inherit" onClick={() => navigate('/')}>Dashboard</Button>
        <Button color="inherit" onClick={() => navigate('/analytics')}>Analytics</Button>
        <Button color="inherit" onClick={() => navigate('/reports')}>Reports</Button>
        <Button color="inherit" onClick={() => navigate('/hotspots')}>Hotspots</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
