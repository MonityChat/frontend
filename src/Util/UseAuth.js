export default function useAuthentication() {
  const key = sessionStorage.getItem("SESSION_AUTH") || null;
  const isLogedIn = sessionStorage.getItem("LOGED_IN") || false;

  const setKey = (newKey) => {
    sessionStorage.setItem("SESSION_AUTH", newKey);
  };

  const setLogedIn = (newValue) => {
    sessionStorage.setItem("LOGED_IN", newValue);
  };
  return [key, setKey, isLogedIn, setLogedIn];
}
