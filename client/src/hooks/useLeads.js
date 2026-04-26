import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import leadService from '../services/leadService';
import toast from 'react-hot-toast';

// Query hook for fetching leads
export const useLeads = (page = 1, limit = 10, search = '', status = '') => {
    return useQuery({
        queryKey: ['leads', page, search, status],
        queryFn: () => leadService.getLeads(page, limit, search, status),
        keepPreviousData: true,
    });
};

// Query hook for single lead
export const useLead = (id) => {
    return useQuery({
        queryKey: ['lead', id],
        queryFn: () => leadService.getLeadById(id),
        enabled: !!id, // Only run if id exists
    });
};

// Mutation hook for creating lead
export const useCreateLead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (leadData) => leadService.createLead(leadData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            toast.success('Lead created successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create lead');
        },
    });
};

// Mutation hook for updating lead
export const useUpdateLead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => leadService.updateLead(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            queryClient.invalidateQueries({ queryKey: ['lead', variables.id] });
            toast.success('Lead updated successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update lead');
        },
    });
};

// Mutation hook for deleting lead
export const useDeleteLead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => leadService.deleteLead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            toast.success('Lead deleted successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete lead');
        },
    });
};