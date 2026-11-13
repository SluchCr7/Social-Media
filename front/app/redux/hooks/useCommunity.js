'use client';

import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import {
  useAddCommunityMutation,
  useGetCommunitiesQuery,
} from '../features/communities/communitiesApi';
import { useCommunityAdmin } from '@/app/Custome/Community/useCommunityAdmin';
import { useCommunityRequests } from '@/app/Custome/Community/useCommunityRequests';

const EMPTY_COMMUNITIES = [];
const errorMessage = (error) => error?.data?.message || error?.message || null;

export const useCommunity = () => {
  const { user } = useAuth();
  const { showAlert } = useFeedback();
  const communitiesQuery = useGetCommunitiesQuery({
    viewerId: user?._id?.toString() || 'anonymous',
  });
  const [addCommunityRequest] = useAddCommunityMutation();
  const {
    currentData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = communitiesQuery;
  const communities = currentData || EMPTY_COMMUNITIES;

  const fetchCommunities = useCallback(async ({ force = false } = {}) => {
    if (!force && currentData) return currentData;
    return refetch().unwrap();
  }, [currentData, refetch]);

  const addCommunity = useCallback(async (details) => {
    try {
      const data = await addCommunityRequest(details).unwrap();
      const community = data.community || data;
      showAlert(data.message || 'Community created successfully');
      return community;
    } catch (error) {
      console.error(error);
      showAlert(errorMessage(error) || 'Error creating community.');
      throw error;
    }
  }, [addCommunityRequest, showAlert]);

  const communityAdmin = useCommunityAdmin({ showAlert });
  const communityRequests = useCommunityRequests({ showAlert });

  return useMemo(() => ({
    communities,
    isLoading: isLoading || isFetching,
    error: errorMessage(error),
    fetchCommunities,
    addCommunity,
    ...communityAdmin,
    ...communityRequests,
  }), [
    communities,
    isLoading,
    isFetching,
    error,
    fetchCommunities,
    addCommunity,
    communityAdmin,
    communityRequests,
  ]);
};

export default useCommunity;
