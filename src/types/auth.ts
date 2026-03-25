export type UserRole = 'ADMIN' | 'OPERATOR' | 'VIEWER';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}
