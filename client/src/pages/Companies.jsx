import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Business as BusinessIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useCompanies, useCreateCompany } from '../hooks/useCompanies';
import { useCompany } from '../hooks/useCompanies';

const Companies = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
  });

  // Use TanStack Query hooks
  const { data: companies = [], isLoading, error, refetch } = useCompanies();
  const createCompany = useCreateCompany();
  
  // Fetch company details when selected
  const { data: companyDetails, isLoading: isLoadingDetails } = useCompany(
    selectedCompany?._id
  );

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      website: '',
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    createCompany.mutate(formData, {
      onSuccess: () => {
        handleCloseDialog();
      },
    });
  };

  const handleViewCompany = (company) => {
    setSelectedCompany(company);
  };

  const handleCloseDetails = () => {
    setSelectedCompany(null);
  };

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
        <Typography color="error">Error loading companies: {error.message}</Typography>
        <Button onClick={() => refetch()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Companies</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Add Company
          </Button>
        </Box>
      </Box>

      {companies.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No companies found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click the "Add Company" button to create your first company
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {companies.map((company) => (
            <Grid item xs={12} md={6} lg={4} key={company._id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                  }
                }} 
                onClick={() => handleViewCompany(company)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <BusinessIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                    <Typography variant="h6">{company.name}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {company.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Phone:</strong> {company.phone}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Address:</strong> {company.address.substring(0, 50)}...
                  </Typography>
                  {company.website && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Website:</strong> {company.website}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Company Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Company</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address *"
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={createCompany.isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={createCompany.isLoading}
          >
            {createCompany.isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Company Details Dialog */}
      <Dialog
        open={!!selectedCompany}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {isLoadingDetails ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        ) : (
          companyDetails && (
            <>
              <DialogTitle>{companyDetails.company.name}</DialogTitle>
              <DialogContent>
                <Typography variant="h6" gutterBottom>
                  Company Details
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Email:</strong> {companyDetails.company.email}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Phone:</strong> {companyDetails.company.phone}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Address:</strong> {companyDetails.company.address}
                </Typography>
                {companyDetails.company.website && (
                  <Typography variant="body1" paragraph>
                    <strong>Website:</strong> {companyDetails.company.website}
                  </Typography>
                )}

                <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                  Associated Leads ({companyDetails.leads?.length || 0})
                </Typography>
                <List>
                  {companyDetails.leads?.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                      No leads associated with this company.
                    </Typography>
                  ) : (
                    companyDetails.leads?.map((lead, index) => (
                      <React.Fragment key={lead._id}>
                        <ListItem>
                          <ListItemText
                            primary={lead.name}
                            secondary={`${lead.email} - ${lead.phone} - Status: ${lead.status}`}
                          />
                        </ListItem>
                        {index < companyDetails.leads.length - 1 && <Divider />}
                      </React.Fragment>
                    ))
                  )}
                </List>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDetails}>Close</Button>
              </DialogActions>
            </>
          )
        )}
      </Dialog>
    </Box>
  );
};

export default Companies;