interface TokenData {
  token: string;
  expiresAt: number;
  userType: string;
}

export const tokenStorage = {
  // Store token with 24-hour expiration
  setToken(token: string, userType: string) {
    // Remove 'Bearer ' if it exists in the token
    const cleanToken = token.replace('Bearer ', '');
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now
    const tokenData: TokenData = {
      token: cleanToken,
      expiresAt,
      userType
    };
    localStorage.setItem('tokenData', JSON.stringify(tokenData));
  },

  // Get token if it exists and isn't expired
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    const tokenDataString = localStorage.getItem('tokenData');
    if (!tokenDataString) return null;

    try {
      const tokenData: TokenData = JSON.parse(tokenDataString);
      if (Date.now() > tokenData.expiresAt) {
        this.clearToken();
        return null;
      }

      return tokenData.token;
    } catch (error) {
      console.error('Error parsing token data:', error);
      this.clearToken();
      return null;
    }
  },

  // Get user type
  getUserType(): string | null {
    if (typeof window === 'undefined') return null;
    
    const tokenDataString = localStorage.getItem('tokenData');
    if (!tokenDataString) return null;

    try {
      const tokenData: TokenData = JSON.parse(tokenDataString);
      return tokenData.userType;
    } catch (error) {
      console.error('Error parsing token data:', error);
      return null;
    }
  },

  // Clear token data
  clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tokenData');
    }
  }
}; 