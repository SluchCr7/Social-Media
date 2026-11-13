'use client';

import { useCallback } from 'react';
import {
  useApproveCommunityJoinRequestMutation,
  useJoinCommunityMutation,
  useRejectCommunityJoinRequestMutation,
  useSendCommunityJoinRequestMutation,
} from '@/app/redux/features/communities/communitiesApi';

const errorMessage = (error, fallback) => error?.data?.message || error?.message || fallback;

export const useCommunityRequests = ({ showAlert }) => {
  const [sendRequest] = useSendCommunityJoinRequestMutation();
  const [approveRequest] = useApproveCommunityJoinRequestMutation();
  const [rejectRequest] = useRejectCommunityJoinRequestMutation();
  const [joinRequest] = useJoinCommunityMutation();

  const sendJoinRequest = useCallback(async (id) => {
    try {
      const data = await sendRequest(id).unwrap();
      showAlert(data.message);
      return true;
    } catch (error) {
      console.error(error);
      showAlert(errorMessage(error, 'Failed to send join request.'));
      return false;
    }
  }, [sendRequest, showAlert]);

  const approveJoinRequest = useCallback(async (communityId, userId) => {
    try {
      const data = await approveRequest({ communityId, userId }).unwrap();
      showAlert(data.message);
      return true;
    } catch (error) {
      console.error(error);
      showAlert(errorMessage(error, 'Failed to approve join request.'));
      return false;
    }
  }, [approveRequest, showAlert]);

  const rejectJoinRequest = useCallback(async (communityId, userId) => {
    try {
      const data = await rejectRequest({ communityId, userId }).unwrap();
      showAlert(data.message);
      return true;
    } catch (error) {
      console.error(error);
      showAlert(errorMessage(error, 'Failed to reject join request.'));
      return false;
    }
  }, [rejectRequest, showAlert]);

  const joinToCommunity = useCallback(async (id) => {
    try {
      const data = await joinRequest(id).unwrap();
      showAlert(data.message);
      return true;
    } catch (error) {
      console.error(error);
      showAlert(errorMessage(error, 'Error updating community membership.'));
      return false;
    }
  }, [joinRequest, showAlert]);

  return {
    sendJoinRequest,
    approveJoinRequest,
    rejectJoinRequest,
    joinToCommunity,
  };
};
