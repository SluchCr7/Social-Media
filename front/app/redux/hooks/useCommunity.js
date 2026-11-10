'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import api from '@/app/utils/api';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector, useAppStore } from '../hooks';
import {
  selectCommunities,
  selectCommunitiesLoading,
} from '../features/communities/communitiesSelectors';
import {
  setCommunities as setReduxCommunities,
  addCommunityToState,
  setIsLoading,
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

  const setCommunities = useCallback(
    (c) => {
      const currentCommunities = selectCommunities(store.getState());
      dispatch(setReduxCommunities(typeof c === 'function' ? c(currentCommunities) : c));
    },
    [dispatch, store]
  );

  const fetchCommunities = useCallback(async () => {
    dispatch(setIsLoading(true));
    try {
      const res = await api.get('/community');
      dispatch(setReduxCommunities(Array.isArray(res.data) ? res.data : []));
    } catch (err) {
      console.error('Failed to fetch communities:', err);
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch]);

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
    user,
    communities,
    setCommunities,
    showAlert,
  });

  useEffect(() => {
    if (user?.token) {
      fetchCommunities();
    }
  }, [user?.token, fetchCommunities]);

  return useMemo(
    () => ({
      communities,
      setCommunities,
      isLoading,
      fetchCommunities,
      addCommunity,
      ...communityAdmin,
      ...communityRequests,
    }),
    [communities, setCommunities, isLoading, fetchCommunities, addCommunity, communityAdmin, communityRequests]
  );
};

export default useCommunity;
