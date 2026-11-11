import api from "../../utils/api";
import { useCallback } from "react";

export const useCommunityAdmin = ({ setCommunities, showAlert }) => {
  const editCommunity = useCallback(async (id, updatedData) => {
    try {
      if (!updatedData || Object.keys(updatedData).length === 0) {
        showAlert("No changes to update.");
        return null;
      }

      const res = await api.put(`/community/edit/${id}`, updatedData);
      setCommunities((previous) =>
        previous.map((community) =>
          community._id === id ? { ...community, ...(res.data.community || {}) } : community
        )
      );
      showAlert(res.data.message || "Community updated successfully.");
      return res.data.community;
    } catch (err) {
      console.error("editCommunity error:", err);
      showAlert(err.response?.data?.message || "Failed to update community.");
      throw err;
    }
  }, [setCommunities, showAlert]);

  const updateCommunityPicture = useCallback(async (id, file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post(`/community/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCommunities((previous) =>
        previous.map((community) =>
          community._id === id
            ? { ...community, Picture: { url: res.data.url, publicId: res.data.publicId } }
            : community
        )
      );
      showAlert(res.data.message || "Picture updated successfully.");
      return res.data;
    } catch (err) {
      console.error("updateCommunityPicture error:", err);
      showAlert(err.response?.data?.message || "Failed to update picture.");
      return null;
    }
  }, [setCommunities, showAlert]);

  const updateCommunityCover = useCallback(async (id, file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post(`/community/update-cover/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCommunities((previous) =>
        previous.map((community) =>
          community._id === id
            ? { ...community, Cover: { url: res.data.url, publicId: res.data.publicId } }
            : community
        )
      );
      showAlert(res.data.message || "Cover updated successfully.");
      return res.data;
    } catch (err) {
      console.error("updateCommunityCover error:", err);
      showAlert(err.response?.data?.message || "Failed to update cover.");
      return null;
    }
  }, [setCommunities, showAlert]);

  const removeMember = useCallback(async (communityId, userId) => {
    try {
      const res = await api.put(`/community/remove/${communityId}/${userId}`);
      showAlert(res.data.message || "Member removed successfully.");
      if (res.data.community) {
        setCommunities((previous) =>
          previous.map((community) =>
            community._id === communityId ? { ...community, ...res.data.community } : community
          )
        );
      }
    } catch (err) {
      console.error("removeMember error:", err);
      showAlert(err.response?.data?.message || "Failed to remove member.");
    }
  }, [setCommunities, showAlert]);

  const makeAdmin = useCallback(async (communityId, userIdToMakeAdmin) => {
    try {
      const res = await api.put(`/community/admin/${communityId}`, { userIdToMakeAdmin });
      const { message, community: updatedCommunity } = res.data;
      showAlert(message);
      if (updatedCommunity) {
        setCommunities((previous) =>
          previous.map((community) =>
            community._id === communityId ? { ...community, ...updatedCommunity } : community
          )
        );
      }
    } catch (err) {
      console.error("makeAdmin error:", err);
      showAlert(err.response?.data?.message || "Failed to update admin role.");
    }
  }, [setCommunities, showAlert]);

  const updateCommunityRules = useCallback(async (id, rules) => {
    try {
      const res = await api.put(`/community/rules/${id}`, { rules });
      showAlert(res.data.message);
      setCommunities((previous) =>
        previous.map((community) =>
          community._id === id ? { ...community, ...(res.data.community || { rules: res.data.rules }) } : community
        )
      );
    } catch (err) {
      console.error("updateCommunityRules error:", err);
      showAlert(err.response?.data?.message || "Failed to update community rules.");
    }
  }, [setCommunities, showAlert]);

  return {
    editCommunity,
    updateCommunityPicture,
    updateCommunityCover,
    removeMember,
    makeAdmin,
    updateCommunityRules,
  };
};
