import { apiClient } from '../../lib/apiClient';
import type { Discussion, DiscussionDetail, CreateDiscussionData, CreateReplyData, DiscussionReply } from './types';

export const discussionApi = {
  // List discussions
  getDiscussions: async (category?: string) => {
    const path = category ? `/discussions/?category=${category}` : '/discussions/';
    return apiClient.get<Discussion[]>(path);
  },

  // Get single discussion
  getDiscussion: async (id: number) => {
    return apiClient.get<DiscussionDetail>(`/discussions/${id}`);
  },

  // Create discussion
  createDiscussion: async (data: CreateDiscussionData) => {
    return apiClient.post<Discussion, CreateDiscussionData>('/discussions/', data);
  },

  // Create reply
  createReply: async (discussionId: number, data: CreateReplyData) => {
    return apiClient.post<DiscussionReply, CreateReplyData>(`/discussions/${discussionId}/replies`, data);
  },
};
