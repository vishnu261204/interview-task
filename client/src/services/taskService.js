import api from './api';

const taskService = {
  getTasks: async (status = '') => {
    const response = await api.get('/tasks', { params: { status } });
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTaskStatus: async (id, status) => {
    const response = await api.put(`/tasks/${id}`, { status });
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default taskService;