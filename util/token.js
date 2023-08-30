export const token = () => {
  const tokenText = localStorage.getItem("user");
  const token = JSON.parse(tokenText);
  if (!token) {
    return null;
  }
  return token;
};
