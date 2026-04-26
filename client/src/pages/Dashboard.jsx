import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Today as TodayIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useDashboardStats } from '../hooks/useDashboard';

const Dashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={5}>
        <Typography color="error">Error loading dashboard: {error.message}</Typography>
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Leads',
      value: stats?.totalLeads || 0,
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#e3f2fd',
    },
    {
      title: 'Qualified Leads',
      value: stats?.qualifiedLeads || 0,
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50' }} />,
      color: '#e8f5e9',
    },
    {
      title: 'Tasks Due Today',
      value: stats?.tasksDueToday || 0,
      icon: <TodayIcon sx={{ fontSize: 40, color: '#ff9800' }} />,
      color: '#fff3e0',
    },
    {
      title: 'Completed Tasks',
      value: stats?.completedTasks || 0,
      icon: <AssignmentIcon sx={{ fontSize: 40, color: '#9c27b0' }} />,
      color: '#f3e5f5',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ backgroundColor: card.color }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h3">
                      {card.value}
                    </Typography>
                  </Box>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Leads by Status
              </Typography>
              <List>
                {stats?.leadsByStatus?.map((status, index) => (
                  <React.Fragment key={status._id}>
                    <ListItem>
                      <ListItemText
                        primary={status._id}
                        secondary={`${status.count} leads`}
                      />
                      <Chip label={status.count} color="primary" />
                    </ListItem>
                    {index < stats.leadsByStatus.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Leads
              </Typography>
              <List>
                {stats?.recentLeads?.map((lead, index) => (
                  <React.Fragment key={lead._id}>
                    <ListItem>
                      <ListItemText
                        primary={lead.name}
                        secondary={`${lead.company?.name} - ${lead.status}`}
                      />
                    </ListItem>
                    {index < stats.recentLeads.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;