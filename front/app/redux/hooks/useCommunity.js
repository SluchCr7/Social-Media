'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import api from '@/app/utils/api';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector, useAppStore } from '../hooks';
import {
  selectCommunities,
  selectCommunitiesLoading,
  selectCommunitiesLoadedOnce,
  selectCommunitiesError,
} from '../features/communities/communitiesSelectors';
import {
  setCommunities as setReduxCommunities,
  addCommunityToState,
  setIsLoading,
  setCommunitiesError,
  setCommunitiesLoadedFor,
} from '../features/communities/communitiesSlice';
import { useCommunityAdmin } from '@/app/Custome/Community/useCommunityAdmin';
import { useCommunityRequests } from '@/app/Custome/Community/useCommunityRequests';



export const useCommunity = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const { user } = useAuth();
  const { showAlert } = useFeedback();

  const communities = useAppSelector(selectCommunities);
  const isLoading = useAppSelector(selectCommunitiesLoading);
  const hasLoadedOnce = useAppSelector(selectCommunitiesLoadedOnce);
  const error = useAppSelector(selectCommunitiesError);

  const setCommunities = useCallback(
    (c) => {
      const currentCommunities = selectCommunities(store.getState());
      dispatch(setReduxCommunities(typeof c === 'function' ? c(currentCommunities) : c));
    },
    [dispatch, store]
  );

  const fetchCommunities = useCallback(async ({ force = false } = {}) => {
    const state = store.getState().communities;
    if (state?.isLoading || (!force && state?.hasLoadedOnce)) return;
    dispatch(setIsLoading(true));
    dispatch(setCommunitiesError(null));
    try {
      const res = await api.get('/community');
      dispatch(setReduxCommunities(Array.isArray(res.data) ? res.data : []));
      dispatch(setCommunitiesLoadedFor(user?._id?.toString() || null));
    } catch (err) {
      console.error('Failed to fetch communities:', err);
      dispatch(setCommunitiesError(err?.response?.data?.message || 'Could not load communities. Please try again.'));
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch, store, user?._id]);

  const fetchCommunityById = useCallback(async (id) => {
    const { data } = await api.get(`/community/${id}`);
    const community = data?.community || data;
    if (community?._id) {
      setCommunities((previous) => [
        community,
        ...previous.filter((item) => item._id !== community._id),
      ]);
    }
    return community;
  }, [setCommunities]);

  const addCommunity = useCallback(
    async ({
      Name,
      Category,
      description,
      tags = [],
      rules = [],
      isPrivate = false,
      isForAdults = false,
    }) => {
      try {
        const res = await api.post('/community/add', {
          Name,
          Category,
          description,
          tags,
          rules,
          isPrivate,
          isForAdults,
        });

        const newCommunity = res.data.community || res.data;
        dispatch(addCommunityToState(newCommunity));
        showAlert(res.data.message || 'Community created successfully');
        return newCommunity;
      } catch (err) {
        console.error(err);
        showAlert(err?.response?.data?.message || 'Error creating community.');
        throw err;
      }
    },
    [showAlert, dispatch]
  );

  const communityAdmin = useCommunityAdmin({
    user,
    communities,
    setCommunities,
    showAlert,
  });

  const communityRequests = useCommunityRequests({
    setCommunities,
    showAlert,
  });

  useEffect(() => {
    const state = store.getState().communities;
    const userId = user?._id?.toString() || null;
    if (!state?.hasLoadedOnce || state?.loadedForUserId !== userId) {
      fetchCommunities({ force: true });
    }
  }, [fetchCommunities, hasLoadedOnce, store, user?._id]);

  return useMemo(
    () => ({
      communities,
      setCommunities,
      isLoading,
      error,
      fetchCommunities,
      fetchCommunityById,
      addCommunity,
      ...communityAdmin,
      ...communityRequests,
    }),
    [communities, setCommunities, isLoading, error, fetchCommunities, fetchCommunityById, addCommunity, communityAdmin, communityRequests]
  );
};

export default useCommunity;
