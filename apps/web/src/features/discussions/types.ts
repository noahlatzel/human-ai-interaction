export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'teacher' | 'student' | 'admin';
  gender?: 'male' | 'female';
}

export interface DiscussionReply {
  id: number;
  content: string;
  author_id: string;
  discussion_id: number;
  created_at: string;
  author: User;
}

export interface Discussion {
  id: number;
  topic: string;
  content: string;
  category: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  author: User;
  reply_count: number;
}

export interface DiscussionDetail extends Discussion {
  replies: DiscussionReply[];
}

export interface CreateDiscussionData {
  topic: string;
  content: string;
  category: string;
}

export interface CreateReplyData {
  content: string;
}
