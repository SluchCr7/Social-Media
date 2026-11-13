'use client';

import { useGetUserByIdQuery } from '@/app/redux/features/user/userApi';

export const useGetData = (userId) => {
  const {
    currentData: userData,
    isLoading,
    isFetching,
    error,
  } = useGetUserByIdQuery(userId, { skip: !userId });

  return {
    loading: !userId || isLoading || isFetching,
    userData: userData || null,
    error,
  };
};
