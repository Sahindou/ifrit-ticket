export interface UserRole {
    id: string;
    role: 'USER' | 'ADMIN' | 'MODERATOR';
    tokenVersion?: number;
}