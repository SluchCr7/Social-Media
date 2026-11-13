'use client';

import { useCallback } from 'react';
import {
  useEditCommunityMutation,
  useRemoveCommunityMemberMutation,
  useToggleCommunityAdminMutation,
  useUpdateCommunityCoverMutation,
  useUpdateCommunityPictureMutation,
  useUpdateCommunityRulesMutation,
} from '@/app/redux/features/communities/communitiesApi';

const errorMessage = (error, fallback) => error?.data?.message || error?.message || fallback;

export const useCommunityAdmin = ({ showAlert }) => {
  const [editRequest] = useEditCommunityMutation();
  const [pictureRequest] = useUpdateCommunityPictureMutation();
  const [coverRequest] = useUpdateCommunityCoverMutation();
  const [removeMemberRequest] = useRemoveCommunityMemberMutation();
  const [adminRequest] = useToggleCommunityAdminMutation();
  const [rulesRequest] = useUpdateCommunityRulesMutation();

  const editCommunity = useCallback(async (id, updatedData) => {
    if (!updatedData || Object.keys(updatedData).length === 0) {
      showAlert('No changes to update.');
      return null;
    }
    try {
      const data = await editRequest({ id, body: updatedData }).unwrap();
      showAlert(data.message || 'Community updated successfully.');
      return data.community;
    } catch (error) {
      console.error('editCommunity error:', error);
      showAlert(errorMessage(error, 'Failed to update community.'));
      throw error;
    }
  }, [editRequest, showAlert]);

  const updateCommunityPicture = useCallback(async (id, file) => {
    const body = new FormData();
    body.append('image', file);
    try {
      const data = await pictureRequest({ id, body }).unwrap();
      showAlert(data.message || 'Picture updated successfully.');
      return data;
    } catch (error) {
      console.error('updateCommunityPicture error:', error);
      showAlert(errorMessage(error, 'Failed to update picture.'));
      return null;
    }
  }, [pictureRequest, showAlert]);

  const updateCommunityCover = useCallback(async (id, file) => {
    const body = new FormData();
    body.append('image', file);
    try {
      const data = await coverRequest({ id, body }).unwrap();
      showAlert(data.message || 'Cover updated successfully.');
      return data;
    } catch (error) {
      console.error('updateCommunityCover error:', error);
      showAlert(errorMessage(error, 'Failed to update cover.'));
      return null;
    }
  }, [coverRequest, showAlert]);

  const removeMember = useCallback(async (communityId, userId) => {
    try {
      const data = await removeMemberRequest({ communityId, userId }).unwrap();
      showAlert(data.message || 'Member removed successfully.');
    } catch (error) {
      console.error('removeMember error:', error);
      showAlert(errorMessage(error, 'Failed to remove member.'));
    }
  }, [removeMemberRequest, showAlert]);

  const makeAdmin = useCallback(async (communityId, userIdToMakeAdmin) => {
    try {
      const data = await adminRequest({ communityId, userIdToMakeAdmin }).unwrap();
      showAlert(data.message || 'Admin role updated successfully.');
    } catch (error) {
      console.error('makeAdmin error:', error);
      showAlert(errorMessage(error, 'Failed to update admin role.'));
    }
  }, [adminRequest, showAlert]);

  const updateCommunityRules = useCallback(async (id, rules) => {
    try {
      const data = await rulesRequest({ id, rules }).unwrap();
      showAlert(data.message || 'Community rules updated.');
    } catch (error) {
      console.error('updateCommunityRules error:', error);
      showAlert(errorMessage(error, 'Failed to update community rules.'));
    }
  }, [rulesRequest, showAlert]);

  return {
    editCommunity,
    updateCommunityPicture,
    updateCommunityCover,
    removeMember,
    makeAdmin,
    updateCommunityRules,
  };
};
