import api from './api';

export interface ProjectResponse {
  id: number;
  name: string;
  key: string;
  description: string;
  organizationId: number;
  status: string;
}

export const projectService = {
  getOrganizationProjects: async (orgId: number): Promise<ProjectResponse[]> => {
    const response = await api.get(`/projects/organization/${orgId}`);
    return response.data;
  },

  getProject: async (projectId: number): Promise<ProjectResponse> => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },

  createProject: async (data: { name: string; key: string; description: string; organizationId: number }): Promise<ProjectResponse> => {
    const response = await api.post('/projects', data);
    return response.data;
  },
};
