import { Outlet, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Spin } from 'antd';

const Protected = () => {
  const { user, loading } = useAuthContext();

  if (loading) return <Spin />;

  return user ? <Navigate to="/" />:<Outlet />;
};

export default Protected;
