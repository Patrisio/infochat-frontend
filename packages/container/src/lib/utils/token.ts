export const updateToken = (token: string) => {
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token');
  }

  localStorage.setItem('token', token);
};