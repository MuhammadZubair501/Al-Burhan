import { useState, useEffect } from 'react';

interface RememberMeState {
  email: string;
  rememberMe: boolean;
}

export function useRememberMe() {
  const [state, setState] = useState<RememberMeState>({
    email: '',
    rememberMe: false
  });

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (savedEmail && savedRememberMe) {
      setState({
        email: savedEmail,
        rememberMe: true
      });
    }
  }, []);

  // Save credentials
  const saveCredentials = (email: string, remember: boolean) => {
    if (remember) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberMe');
    }
    
    setState({ email, rememberMe: remember });
  };

  // Clear saved credentials
  const clearCredentials = () => {
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberMe');
    setState({ email: '', rememberMe: false });
  };

  return {
    ...state,
    saveCredentials,
    clearCredentials
  };
}