import ApiRoutes from './ApiRoutes';

export const otpService = {
  // Send OTP
  sendOTP: async (email: string): Promise<{ success: boolean; message: string; expiresAt?: number; error?: string }> => {
    try {
      if (!email) {
        return {
          success: false,
          message: 'Email is required',
          error: 'EMAIL_REQUIRED'
        };
      }

      const response = await fetch(ApiRoutes.sendOTP(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      return await response.json();
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        message: 'Network error occurred',
        error: 'NETWORK_ERROR'
      };
    }
  },

  // Verify OTP
  verifyOTP: async (email: string, otp: string): Promise<{ success: boolean; message: string; error?: string }> => {
    try {
      if (!email || !otp) {
        return {
          success: false,
          message: 'Email and OTP are required',
          error: 'MISSING_FIELDS'
        };
      }

      if (otp.length !== 6) {
        return {
          success: false,
          message: 'OTP must be 6 digits',
          error: 'INVALID_OTP'
        };
      }

      const response = await fetch(ApiRoutes.verifyOTP(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      return await response.json();
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        message: 'Network error occurred',
        error: 'NETWORK_ERROR'
      };
    }
  }
};