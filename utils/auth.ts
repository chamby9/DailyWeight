let authStateChecked = false;

export const markAuthStateAsChecked = () => {
  authStateChecked = true;
};

export const hasAuthStateBeenChecked = () => {
  return authStateChecked;
};

export const clearAuthState = () => {
  localStorage.removeItem('su