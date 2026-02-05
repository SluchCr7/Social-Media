'use client';

import React, { createContext, useCallback, useContext, useEffect, useState, useMemo } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';
import { useSocket } from './SocketContext';
import { useCommunityAdmin } from '../Custome/Community/useCommunityAdmin';
import { useCommunityRequests } from '../Custome/Community/useCommunityRequests';

export const CommunityContext = createContext();

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityContextProvider');
  }
  return context;
};

export const CommunityContextProvider = ({ children }) => {
  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { socket } = useSocket();

  // --- Actions ---

  /**
   * Fetch all communities
   */
  const fetchCommunities = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/community');
      setCommunities(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch communities:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add a new community
   */
  const addCommunity = useCallback(async ({
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
        Name, Category, description, tags, rules, isPrivate, isForAdults
      });

      const newCommunity = res.data.community || res.data;
      setCommunities((prev) => [...prev, newCommunity]);
      showAlert(res.data.message || 'Community created successfully');
      return newCommunity;
    } catch (err) {
      console.error(err);
      showAlert(err?.response?.data?.message || 'Error creating community.');
    }
  }, [showAlert]);

  // --- External Hooks for Admin/Requests ---
  // Note: These hooks should also be refactored to use the api utility if they don't already.
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

  // --- Effects ---

  useEffect(() => {
    if (user?.token) {
      fetchCommunities();
    }
  }, [user?.token, fetchCommunities]);

  // 🔔 Socket Listeners
  useEffect(() => {
    if (!socket) return;

    const handleCreate = (newCom) => {
      const currentUserId = user?._id?.toString();
      const ownerId = newCom?.owner?._id?.toString() || newCom?.owner?.toString();
      if (currentUserId && ownerId === currentUserId) return;
      setCommunities(prev => [newCom, ...prev]);
    };
    const handleUpdate = (updated) => setCommunities(prev => prev.map(c => c._id === updated._id ? updated : c));
    const handleDelete = (id) => setCommunities(prev => prev.filter(c => c._id !== id));

    socket.on("community:create", handleCreate);
    socket.on("community:update", handleUpdate);
    socket.on("community:delete", handleDelete);

    return () => {
      socket.off("community:create", handleCreate);
      socket.off("community:update", handleUpdate);
      socket.off("community:delete", handleDelete);
    };
  }, [socket, user]);

  // --- Context Value ---
  const value = useMemo(() => ({
    communities,
    setCommunities,
    isLoading,
    fetchCommunities,
    addCommunity,
    ...communityAdmin,
    ...communityRequests,
  }), [
    communities, isLoading, fetchCommunities, addCommunity,
    communityAdmin, communityRequests
  ]);

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};
