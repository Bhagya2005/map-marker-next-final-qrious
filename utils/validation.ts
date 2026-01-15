export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const isValidEmail = (email: string): boolean => {
  return email.includes("@");
};
