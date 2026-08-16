import api from './api';

export type IssueStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'TESTING' | 'DONE' | 'CLOSED';
export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IssueType = 'EPIC' | 'STORY' | 'TASK' | 'BUG';

export interface IssueResponse {
  id: number;
  issueKey: string;
  title: string;
  description: string;
  projectId: number;
  projectName?: string;
  projectKey?: string;
  creatorId?: number;
  creatorName?: string;
  assigneeId?: number;
  assigneeName?: string;
  priority: IssuePriority;
  status: IssueStatus;
  type: IssueType;
  storyPoints?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const issueService = {
  getProjectIssues: async (projectId: number): Promise<IssueResponse[]> => {
    // using size=100 to get a batch of issues for the board without dealing with pagination right away
    const response = await api.get(`/issues/project/${projectId}?size=100`);
    return response.data.content; // Spring Boot Page<T> wraps data in `content` array
  },

  updateIssueStatus: async (issueId: number, status: IssueStatus): Promise<IssueResponse> => {
    const response = await api.put(`/issues/${issueId}`, { status });
    return response.data;
  },

  createIssue: async (data: { projectId: number; title: string; description: string; type: IssueType; priority: IssuePriority }): Promise<IssueResponse> => {
    const response = await api.post('/issues', data);
    return response.data;
  }
};
