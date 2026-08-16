import api from './api';

export interface OrganizationResponse {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export const organizationService = {
  getUserOrganizations: async (): Promise<OrganizationResponse[]> => {
    const response = await api.get('/organizations');
    return response.data;
  },

  createOrganization: async (data: { name: string; description: string }): Promise<OrganizationResponse> => {
    const response = await api.post('/organizations', data);
    return response.data;
  },
};
