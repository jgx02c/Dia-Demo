interface LoginFormData {
  organization: string;
  email: string;
  password: string;
  twoFactorCode: string;
}

export const authService = {
  validateOrganization: async (organization: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/validate-org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organization }),
      });
      if (!response.ok) throw new Error('Invalid organization');
      return true;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Invalid organization');
    }
  },

  validateCredentials: async (data: Pick<LoginFormData, 'organization' | 'email' | 'password'>): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/validate-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Invalid credentials');
      return true;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Invalid credentials');
    }
  },

  validate2FA: async (data: Pick<LoginFormData, 'organization' | 'email' | 'twoFactorCode'>): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/validate-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Invalid 2FA code');
      return true;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Invalid 2FA code');
    }
  },
}; 