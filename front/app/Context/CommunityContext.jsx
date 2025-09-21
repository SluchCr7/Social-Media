
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import getData from '../utils/getData';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';
import { useNotify } from './NotifyContext';

export const CommunityContext = createContext();
export const useCommunity = () => useContext(CommunityContext);

export const CommunityContextProvider = ({ children }) => {
  const [communities, setCommunities] = useState([]);
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const {addNotify} = useNotify()
  useEffect(() => {
    if (user?.token) {
      getData('community', setCommunities);
    }
  }, [user?.token]);

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  // 📌 إرسال طلب انضمام
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

      // 📢 إرسال إشعار لصاحب الطلب
      await addNotify({
        content: `You have been approved to join the community`,
        type: 'community',
        receiverId: userId,
        actionRef: communityId,
        actionModel: 'Community',
      });

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

      // 📢 إرسال إشعار لصاحب الطلب
      await addNotify({
        content: `You have been rejected to join the community`,
        type: 'community',
        receiverId: userId,
        actionRef: communityId,
        actionModel: 'Community',
      });

    } catch (err) {
      console.error(err);
      showAlert('Failed to reject join request.');
    }
  };


  // 📌 تحديث القوانين
  const updateCommunityRules = async (id, rules) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/rules/${id}`,
        { rules },
        config
      );
      showAlert(res.data.message);

      // تحديث الـ state
      setCommunities((prev) =>
        prev.map((c) => (c._id === id ? { ...c, rules } : c))
      );
    } catch (err) {
      console.error(err);
      showAlert('Failed to update community rules.');
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

  // 📌 إضافة مجتمع جديد
  // const addCommunity = async (Name, Category, description) => {
  //   try {
  //     const res = await axios.post(
  //       `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/add`,
  //       { Name, Category, description },
  //       config
  //     );

  //     const communityId = res.data._id;

  //     if (communityId) {
  //       const communityRes = await axios.get(
  //         `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/${communityId}`,
  //         config
  //       );

  //       const newCommunity = communityRes.data;
  //       setCommunities((prev) => [...prev, newCommunity]);

  //       showAlert('Community created successfully');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     showAlert('Error creating community.');
  //   }
  // };


  const addCommunity = async ({ Name, Category, description, tags = [], rules = [], isPrivate = false, isForAdults = false }) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/add`,
      { Name, Category, description, tags, rules, isPrivate, isForAdults },
      config
    );

    const communityId = res.data._id;

    if (communityId) {
      const communityRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/${communityId}`,
        config
      );

      const newCommunity = communityRes.data;
      setCommunities((prev) => [...prev, newCommunity]);

      showAlert('Community created successfully');
    }
  } catch (err) {
    console.error(err);
    showAlert('Error creating community.');
  }
};
  // 📌 تعديل مجتمع
const editCommunity = async (id, updatedData) => {
  try {
    if (!updatedData || Object.keys(updatedData).length === 0) {
      showAlert("No changes to update.");
      return null;
    }

    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/edit/${id}`,
      updatedData,
      config
    );

    // تحديث الـ state
    setCommunities((prev) =>
      prev.map((c) =>
        c._id === id ? { ...c, ...res.data } : c
      )
    );

    showAlert(res.data.message || "Community updated successfully.");
    return res.data;
  } catch (err) {
    console.error(err);
    const msg = err.response?.data?.message || "Failed to update community.";
    showAlert(msg);
    return null;
  }
};


  // 📌 تحديث صورة المجتمع
  const updateCommunityPicture = async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      showAlert(res.data.message || 'Picture updated.');
      return res.data;
    } catch (err) {
      console.error(err);
      showAlert('Failed to update picture.');
      return null;
    }
  };

  // 📌 تحديث غلاف المجتمع
  const updateCommunityCover = async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/update-cover/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      showAlert(res.data.message || 'Cover updated.');
      return res.data;
    } catch (err) {
      console.error(err);
      showAlert('Failed to update cover.');
      return null;
    }
  };

  // 📌 إزالة عضو
  const removeMember = async (communityId, userId) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/remove/${communityId}/${userId}`,
        {},
        config
      );
      showAlert(res.data.message);
    } catch (err) {
      console.error(err);
      showAlert('Failed to remove member.');
    }
  };

  // 📌 جعل/إزالة أدمن
  const makeAdmin = async (communityId, userIdToMakeAdmin) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/admin/${communityId}`,
        { userIdToMakeAdmin },
        config
      );

      showAlert(res.data.message);

      setCommunities((prev) =>
        prev.map((c) =>
          c._id === communityId
            ? {
                ...c,
                Admins:
                  res.data.message === 'Admin added successfully'
                    ? [...c.Admins, userIdToMakeAdmin]
                    : c.Admins.filter((id) => id !== userIdToMakeAdmin),
              }
            : c
        )
      );
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to update admin role';
      showAlert(msg);
    }
  };

  return (
    <CommunityContext.Provider
      value={{
        communities,
        setCommunities,
        addCommunity,
        joinToCommunity,
        editCommunity,
        updateCommunityPicture,
        updateCommunityCover,
        removeMember,
        makeAdmin,
        sendJoinRequest,
        approveJoinRequest,
        rejectJoinRequest,
        updateCommunityRules,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};
