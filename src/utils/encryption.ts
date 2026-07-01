// Simple base64 encoding/decoding (not secure, just obfuscation)
// For better security, use a proper encryption library

export const encryptPassword = (password: string): string => {
  return btoa(password); // Base64 encode
};

export const decryptPassword = (encrypted: string): string => {
  try {
    return atob(encrypted); // Base64 decode
  } catch {
    return '';
  }
};