
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import getData from '../utils/getData';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';
import { useNotify } from './NotifyContext';
import { useCommunityAdmin } from '../Custome/Community/useCommunityAdmin';
import { useCommunityRequests } from '../Custome/Community/useCommunityRequests';

export const CommunityContext = createContext();
export const useCommunity = () => useContext(CommunityContext);

export const CommunityContextProvider = ({ children }) => {
  const [communities, setCommunities] = useState([]);
  const { user } = useAuth();
  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };
  const { showAlert } = useAlert();
  const {
    updateCommunityCover,
    updateCommunityRules,
    updateCommunityPicture,
    makeAdmin,
    editCommunity,
    removeMember,
  } = useCommunityAdmin({
    user,
    communities,
    setCommunities,
    config,
    showAlert,
  });

  const {
    joinToCommunity,
    sendJoinRequest,
    approveJoinRequest,
    rejectJoinRequest,
  } = useCommunityRequests({
    user,
    communities,
    setCommunities,
    config,
    showAlert,
  });
  useEffect(() => {
    if (user?.token) {
      getData('community', setCommunities);
    }
  }, [user?.token]);


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
