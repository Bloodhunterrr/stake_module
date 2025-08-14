import { useGetUserInfoQuery } from '@/services/authApi';

export const useUserInfo = () => {
  const token = localStorage.getItem('token');
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetUserInfoQuery(undefined, {
    skip: !token,
    pollingInterval: 15e3,
  });

  return {
    user: data,
    isAuthenticated: !!data && !isError,
    isLoading,
    isError,
    refetch,
  };
};