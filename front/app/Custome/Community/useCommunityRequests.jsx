'use client';
import api from '@/app/utils/api';
import { useCallback } from 'react';
export const useCommunityRequests = ({
    user,
    setCommunities,
    showAlert
}) => {
  const sendJoinRequest = useCallback(async (id) => {
    try {
      const res = await api.post(`/community/join-request/${id}`);
      showAlert(res.data.message);
      setCommunities((prev) =>
        prev.map((community) => {
          if (community._id !== id) return community;
          const requests = community.joinRequests || [];
          const hasRequest = requests.some(
            (requestId) => (requestId?._id || requestId).toString() === user._id
          );
          return hasRequest
            ? community
            : { ...community, joinRequests: [...requests, user._id] };
        })
      );
    } catch (err) {
      console.error(err);
      showAlert('Failed to send join request.');
    }
  }, [user, setCommunities, showAlert]);

  const approveJoinRequest = useCallback(async (communityId, userId) => {
    try {
      const res = await api.put(`/community/join-request/approve/${communityId}/${userId}`);
      showAlert(res.data.message);

      // تحديث الـ members محليًا
      setCommunities((prev) =>
        prev.map((c) =>
          c._id === communityId
            ? {
                ...c,
                members: (c.members || []).some(
                  (member) => (member?._id || member).toString() === userId
                )
                  ? c.members
                  : [...(c.members || []), userId],
                joinRequests: (c.joinRequests || []).filter(
                  (requestId) => (requestId?._id || requestId).toString() !== userId
                ),
              }
            : c
        )
      );

    } catch (err) {
      console.error(err);
      showAlert('Failed to approve join request.');
    }
  }, [setCommunities, showAlert]);

// 📌 رفض طلب انضمام
  const rejectJoinRequest = useCallback( async (communityId, userId) => {
    try {
      const res = await api.put(`/community/join-request/reject/${communityId}/${userId}`);
      showAlert(res.data.message);
      setCommunities((prev) =>
        prev.map((community) =>
          community._id === communityId
            ? {
                ...community,
                joinRequests: (community.joinRequests || []).filter(
                  (requestId) => (requestId?._id || requestId).toString() !== userId
                ),
              }
            : community
        )
      );
    } catch (err) {
      console.error(err);
      showAlert('Failed to reject join request.');
    }
  }, [setCommunities, showAlert]);


  // 📌 الانضمام أو المغادرة
  const joinToCommunity = useCallback(async (id) => {
    try {
      const res = await api.put(`/community/join/${id}`);
      showAlert(res.data.message);

      setCommunities((prev) =>
        prev.map((c) =>
          c._id === id
            ? {
                ...c,
                members:
                  res.data.message === 'Community Joined'
                  ? [...(c.members || []), user._id]
                  : (c.members || []).filter((member) => (member?._id || member).toString() !== user._id),
              }
            : c
        )
      );
    } catch (err) {
      console.error(err);
      showAlert('Error joining community.');
    }
  }, [user, setCommunities, showAlert]);
    return {
        sendJoinRequest,
        approveJoinRequest,
        rejectJoinRequest,
        joinToCommunity
    }
};