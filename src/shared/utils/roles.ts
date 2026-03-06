const ROLE_LABELS: Record<string, string> = {
  ROLE_ADMIN: 'Administrador',
  ROLE_USER: 'Leitor',
};

export function getRoleLabel(role: string): string {
  return ROLE_LABELS[role] || role;
}

export function getPrimaryRoleLabel(roles?: string[]): string {
  if (!roles || roles.length === 0) {
    return 'Leitor';
  }

  return roles.includes('ROLE_ADMIN') ? ROLE_LABELS.ROLE_ADMIN : ROLE_LABELS.ROLE_USER;
}
