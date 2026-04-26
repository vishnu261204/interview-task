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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useTasks, useCreateTask, useUpdateTaskStatus, useDeleteTask } from '../hooks/useTasks';
import { useLeads } from '../hooks/useLeads';
import { useUsers } from '../hooks/useUsers';

const Tasks = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    lead: '',
    assignedTo: '',
    dueDate: '',
    status: 'Pending',
  });

  // Use TanStack Query hooks
  const { data: tasks = [], isLoading, error, refetch } = useTasks();
  const createTask = useCreateTask();
  const updateTaskStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();
  const { data: leadsData } = useLeads(1, 100);
  const { data: users = [] } = useUsers();

  const leads = leadsData?.leads || [];

  const handleOpenDialog = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDueDate = tomorrow.toISOString().split('T')[0];

    setFormData({
      title: '',
      lead: '',
      assignedTo: '',
      dueDate: defaultDueDate,
      status: 'Pending',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    if (!formData.lead) {
      toast.error('Please select a lead');
      return;
    }
    if (!formData.assignedTo) {
      toast.error('Please assign this task to a user');
      return;
    }
    if (!formData.dueDate) {
      toast.error('Please select a due date');
      return;
    }

    createTask.mutate(formData, {
      onSuccess: () => {
        handleCloseDialog();
      },
    });
  };

  const handleStatusToggle = (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    updateTaskStatus.mutate({ id: taskId, status: newStatus });
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask.mutate(taskId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
        <Typography color="error">Error loading tasks: {error.message}</Typography>
        <Button onClick={() => refetch()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Tasks</Typography>
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
            Add Task
          </Button>
        </Box>
      </Box>

      {tasks.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click the "Add Task" button to create your first task
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} md={6} lg={4} key={task._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Typography variant="h6" gutterBottom>
                      {task.title}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(task._id)}
                      color="error"
                      disabled={deleteTask.isLoading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Lead:</strong> {task.lead?.name || 'N/A'}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Assigned to:</strong> {task.assignedTo?.name || 'N/A'}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Due Date:</strong> {formatDate(task.dueDate)}
                  </Typography>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Chip
                      label={task.status}
                      color={task.status === 'Completed' ? 'success' : 'warning'}
                      size="small"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={task.status === 'Completed'}
                          onChange={() => handleStatusToggle(task._id, task.status)}
                          color="primary"
                          disabled={updateTaskStatus.isLoading}
                        />
                      }
                      label={task.status === 'Completed' ? 'Completed' : 'Mark Complete'}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Enter task title"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Select Lead</InputLabel>
                <Select
                  value={formData.lead}
                  onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
                  label="Select Lead"
                >
                  {leads.length === 0 ? (
                    <MenuItem disabled>No leads available</MenuItem>
                  ) : (
                    leads.map((lead) => (
                      <MenuItem key={lead._id} value={lead._id}>
                        {lead.name} - {lead.company?.name || 'No Company'}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Assign To</InputLabel>
                <Select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  label="Assign To"
                >
                  {users.length === 0 ? (
                    <MenuItem disabled>No users available</MenuItem>
                  ) : (
                    users.map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={createTask.isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={createTask.isLoading}
          >
            {createTask.isLoading ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;