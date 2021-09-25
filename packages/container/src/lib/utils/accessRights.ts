export type Role = 'operator' | 'owner';

export const isProjectOwner = (role: Role) => role === 'owner';