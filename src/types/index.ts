export interface ApiResult<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  photo?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PostAuthor {
  id: string | number;
  name: string;
  photo?: string | null;
}

export interface PostComment {
  id: string | number;
  user_id?: string | number;
  comment: string;
  created_at?: string;
  user?: PostAuthor | null;
}

export interface PostLike {
  id?: string | number;
  user_id: string | number;
}

export interface Post {
  id: string | number;
  user_id?: string | number;
  description: string;
  cover?: string | null;
  created_at?: string;
  updated_at?: string;
  author?: PostAuthor | null;
  likes?: PostLike[];
  comments?: PostComment[];
}
