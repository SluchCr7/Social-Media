import axios from 'axios';
export const useCommunityRequests = ({
    user,
    communities,
    setCommunities,
    config,
    showAlert
}) => {
      const sendJoinRequest = async (id) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/join-request/${id}`,
        {},
        config
      );
      showAlert(res.data.message);
      setCommunities(prev =>
        prev.map(c =>
          c._id === id ? { ...c, joinRequests: [...(c.joinRequests || []), user._id] } : c
        )
      );
    } catch (err) {
      console.error(err);
      showAlert('Failed to send join request.');
    }
  };

  // 📌 الموافقة على طلب انضمام
// 📌 الموافقة على طلب انضمام
  const approveJoinRequest = async (communityId, userId) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/join-request/approve/${communityId}/${userId}`,
        {},
        config
      );
      showAlert(res.data.message);

      // تحديث الـ members محليًا
      setCommunities((prev) =>
        prev.map((c) =>
          c._id === communityId
            ? { ...c, members: [...c.members, userId] }
            : c
        )
      );

    } catch (err) {
      console.error(err);
      showAlert('Failed to approve join request.');
    }
  };

// 📌 رفض طلب انضمام
  const rejectJoinRequest = async (communityId, userId) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/join-request/reject/${communityId}/${userId}`,
        {},
        config
      );
      showAlert(res.data.message);

    } catch (err) {
      console.error(err);
      showAlert('Failed to reject join request.');
    }
  };


  // 📌 الانضمام أو المغادرة
  const joinToCommunity = async (id) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/join/${id}`,
        {},
        config
      );
      showAlert(res.data.message);

      setCommunities((prev) =>
        prev.map((c) =>
          c._id === id
            ? {
                ...c,
                members:
                  res.data.message === 'Community Joined'
                    ? [...c.members, user._id]
                    : c.members.filter((m) => m !== user._id),
              }
            : c
        )
      );
    } catch (err) {
      console.error(err);
      showAlert('Error joining community.');
    }
  };
    return {
        sendJoinRequest,
        approveJoinRequest,
        rejectJoinRequest,
        joinToCommunity
    }
};