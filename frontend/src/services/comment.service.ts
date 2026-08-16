import api from './api';

export interface CommentRequest {
  content: string;
}

export interface CommentResponse {
  id: number;
  issueId: number;
  authorId: number;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const commentService = {
  getIssueComments: async (issueId: number): Promise<CommentResponse[]> => {
    const response = await api.get(`/comments/issue/${issueId}`);
    return response.data;
  },

  addComment: async (issueId: number, content: string): Promise<CommentResponse> => {
    const response = await api.post(`/comments/issue/${issueId}`, { content });
    return response.data;
  },

  updateComment: async (commentId: number, content: string): Promise<CommentResponse> => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },

  deleteComment: async (commentId: number): Promise<void> => {
    await api.delete(`/comments/${commentId}`);
  }
};
