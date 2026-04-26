import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import companyService from '../services/companyService';
import toast from 'react-hot-toast';

export const useCompanies = () => {
    return useQuery({
        queryKey: ['companies'],
        queryFn: () => companyService.getCompanies(),
    });
};

export const useCompany = (id) => {
    return useQuery({
        queryKey: ['company', id],
        queryFn: () => companyService.getCompanyById(id),
        enabled: !!id,
    });
};

export const useCreateCompany = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (companyData) => companyService.createCompany(companyData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
            toast.success('Company created successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create company');
        },
    });
};