import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { getUserDetails } from '../services/UserService.mjs';

const AuthContext = createContext({
  user: null,
  userName: null,
  loading: true,
  setUserDetails: null,
});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const session = await getCurrentUser();
        setUser(session);
        const userDetails = await getUserDetails(session.userId);
        setUserName(userDetails.name);
        setUserDetails(userDetails);
      } catch {
        setUser(null);
        setUserName(null);
        setUserDetails(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userName, userDetails, loading, setUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
