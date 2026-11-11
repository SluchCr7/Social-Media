'use client';
import api from '@/app/utils/api';
import { useCallback } from 'react';

const mergeCommunity = (previous, communityId, updatedCommunity) =>
  previous.map((community) =>
    community._id === communityId ? { ...community, ...updatedCommunity } : community
  );

export const useCommunityRequests = ({
    setCommunities,
    showAlert
}) => {
    const sendJoinRequest = useCallback(async (id) => {
      try {
        const res = await api.post(`/community/join-request/${id}`);
        showAlert(res.data.message);
        if (res.data.community) {
          setCommunities((previous) => mergeCommunity(previous, id, res.data.community));
        }
        return true;
      } catch (err) {
        console.error(err);
        showAlert(err?.response?.data?.message || 'Failed to send join request.');
        return false;
      }
    }, [setCommunities, showAlert]);

  const approveJoinRequest = useCallback(async (communityId, userId) => {
    try {
      const res = await api.put(`/community/join-request/approve/${communityId}/${userId}`);
      showAlert(res.data.message);
      if (res.data.community) {
        setCommunities((previous) => mergeCommunity(previous, communityId, res.data.community));
      }
      return true;
    } catch (err) {
      console.error(err);
      showAlert(err?.response?.data?.message || 'Failed to approve join request.');
      return false;
    }
  }, [setCommunities, showAlert]);

// 📌 رفض طلب انضمام
  const rejectJoinRequest = useCallback( async (communityId, userId) => {
    try {
      const res = await api.put(`/community/join-request/reject/${communityId}/${userId}`);
      showAlert(res.data.message);
      if (res.data.community) {
        setCommunities((previous) => mergeCommunity(previous, communityId, res.data.community));
      }
      return true;
    } catch (err) {
      console.error(err);
      showAlert(err?.response?.data?.message || 'Failed to reject join request.');
      return false;
    }
  }, [setCommunities, showAlert]);


  // 📌 الانضمام أو المغادرة
  const joinToCommunity = useCallback(async (id) => {
    try {
      const res = await api.put(`/community/join/${id}`);
      showAlert(res.data.message);
      if (res.data.community) {
        setCommunities((previous) => mergeCommunity(previous, id, res.data.community));
      }
      return true;
    } catch (err) {
      console.error(err);
      showAlert(err?.response?.data?.message || 'Error updating community membership.');
      return false;
    }
  }, [setCommunities, showAlert]);
    return {
        sendJoinRequest,
        approveJoinRequest,
        rejectJoinRequest,
        joinToCommunity
    }
};