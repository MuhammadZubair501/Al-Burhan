// utils/validation.ts
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Remove spaces for validation
  const cleanPhone = phone.replace(/\s/g, '');
  return /^(\+92|0)[0-9]{10}$/.test(cleanPhone);
};

export const validateCNIC = (cnic: string): boolean => {
  return /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/.test(cnic);
};

export const formatPakPhone = (value: string): string => {
  let digits = value.replace(/\D/g, '');
  if (!digits.startsWith('92')) {
    if (digits.startsWith('0')) digits = '92' + digits.slice(1);
    else if (digits.length > 0 && !digits.startsWith('92')) digits = '92' + digits;
  }
  digits = digits.slice(0, 12);
  let formatted = '+';
  if (digits.length > 0) formatted += digits.slice(0, 2);
  if (digits.length > 2) formatted += ' ' + digits.slice(2, 5);
  if (digits.length > 5) formatted += ' ' + digits.slice(5);
  return formatted;
};

export const formatCNIC = (value: string): string => {
  const digits = value.replace(/[^0-9]/g, '');
  let formatted = '';
  if (digits.length > 0) formatted = digits.slice(0, 5);
  if (digits.length > 5) formatted += '-' + digits.slice(5, 12);
  if (digits.length > 12) formatted += '-' + digits.slice(12, 13);
  return formatted.slice(0, 15);
};

// Emergency number uses the SAME format as phone number
export const validateEmergencyNumber = (number: string): boolean => {
  const cleanNumber = number.replace(/\s/g, '');
  return /^(\+92|0)[0-9]{10}$/.test(cleanNumber);
};

export const formatEmergencyNumber = (value: string): string => {
  // Same formatting as phone number
  let digits = value.replace(/\D/g, '');
  if (!digits.startsWith('92')) {
    if (digits.startsWith('0')) digits = '92' + digits.slice(1);
    else if (digits.length > 0 && !digits.startsWith('92')) digits = '92' + digits;
  }
  digits = digits.slice(0, 12);
  let formatted = '+';
  if (digits.length > 0) formatted += digits.slice(0, 2);
  if (digits.length > 2) formatted += ' ' + digits.slice(2, 5);
  if (digits.length > 5) formatted += ' ' + digits.slice(5);
  return formatted;
};