'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import getData from '../utils/getData';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';

export const CommunityContext = createContext();
export const useCommunity = () => useContext(CommunityContext);

export const CommunityContextProvider = ({ children }) => {
  const [communities, setCommunities] = useState([]);
  const { user } = useAuth();
  const { showAlert } = useAlert();

  useEffect(() => {
    getData('community', setCommunities);
  }, [communities]);

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };



  const joinToCommunity = async (id) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/community/join/${id}`, {}, config);
      showAlert(res.data.message);
    } catch (err) {
      console.error(err);
      showAlert('Error joining community.');
    }
  };
const addCommunity = async (Name, Category, description) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/community/add`, { Name, Category, description }, config);

    const communityId = res.data._id;

    if (communityId) {
      await joinToCommunity(communityId);
    } else {
      console.log('Failed to create community.');
    }

  } catch (err) {
    console.error(err);
    showAlert('Error creating community.');
  }
};

  const editCommunity = async (id, updatedData) => {
      try {
        const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/community/edit/${id}`, updatedData, config);
        showAlert('Community updated.');
        return res.data;
      } catch (err) {
        console.error(err);
        showAlert('Failed to update community.');
      }
  };
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
    
    // ✅ أرجع البيانات الفعلية من السيرفر (الرابط الجديد)
    return res.data;
  } catch (err) {
    console.error("Full Error:", JSON.stringify(err, null, 2));

    const message =
      err?.response?.data?.message || err?.message || 'Failed to update picture.';
    showAlert(message);

    return null;
  }
};

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
    
    // ✅ أرجع البيانات الفعلية من السيرفر (الرابط الجديد)
    return res.data;
  } catch (err) {
    console.error("Full Error:", JSON.stringify(err, null, 2));

    const message =
      err?.response?.data?.message || err?.message || 'Failed to update cover.';
    showAlert(message);

    return null;
  }
};

  const removeMember = async (communityId, userId) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/community/remove/${communityId}/${userId}`, {}, config);
      showAlert(res.data.message);
    } catch (err) {
      console.error(err);
      showAlert('Failed to remove member.');
    }
  };

  const makeAdmin = async (communityId, userIdToMakeAdmin) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/admin/${communityId}`,
        { userIdToMakeAdmin },
        config
      );
      showAlert(res.data.message);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to update admin role";
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
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};
