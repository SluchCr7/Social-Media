import axios from "axios";

export const useCommunityAdmin = ({
  user,
  communities,
  setCommunities,
  config,
  showAlert,
}) => {
  // 🔧 تأمين headers من البداية
  const headers = config || {
    Authorization: `Bearer ${user?.token}`,
  };

  // 📌 تعديل بيانات المجتمع
  const editCommunity = async (id, updatedData) => {
    try {
      if (!updatedData || Object.keys(updatedData).length === 0) {
        showAlert("No changes to update.");
        return null;
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/edit/${id}`,
        updatedData,
        { headers }
      );

      setCommunities((prev) =>
        prev.map((c) => (c._id === id ? { ...c, ...res.data.community } : c))
      );

      showAlert(res.data.message || "Community updated successfully.");
      return res.data.community;
    } catch (err) {
      console.error("❌ editCommunity error:", err);
      const msg = err.response?.data?.message || "Failed to update community.";
      showAlert(msg);
      return null;
    }
  };

  // 📸 تحديث صورة المجتمع
  const updateCommunityPicture = async (id, file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/update/${id}`,
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // تحديث الصورة في الحالة المحلية
      setCommunities((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, Picture: res.data.updatedPicture } : c
        )
      );

      showAlert(res.data.message || "Picture updated successfully.");
      return res.data;
    } catch (err) {
      console.error("❌ updateCommunityPicture error:", err);
      showAlert(err.response?.data?.message || "Failed to update picture.");
      return null;
    }
  };

  // 🖼️ تحديث غلاف المجتمع
  const updateCommunityCover = async (id, file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/update-cover/${id}`,
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCommunities((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, Cover: res.data.updatedCover } : c
        )
      );

      showAlert(res.data.message || "Cover updated successfully.");
      return res.data;
    } catch (err) {
      console.error("❌ updateCommunityCover error:", err);
      showAlert(err.response?.data?.message || "Failed to update cover.");
      return null;
    }
  };

  // 👥 إزالة عضو من المجتمع
  const removeMember = async (communityId, userId) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/remove/${communityId}/${userId}`,
        {},
        { headers }
      );

      showAlert(res.data.message || "Member removed successfully.");

      // تحديث الحالة
      setCommunities((prev) =>
        prev.map((c) =>
          c._id === communityId
            ? { ...c, Members: c.Members.filter((m) => m !== userId) }
            : c
        )
      );
    } catch (err) {
      console.error("❌ removeMember error:", err);
      showAlert(err.response?.data?.message || "Failed to remove member.");
    }
  };

  // 👑 جعل/إزالة أدمن
  const makeAdmin = async (communityId, userIdToMakeAdmin) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/admin/${communityId}`,
        { userIdToMakeAdmin },
        { headers }
      );

      const message = res.data.message;
      showAlert(message);

      setCommunities((prev) =>
        prev.map((c) => {
          if (c._id !== communityId) return c;

          const isAdding = message?.toLowerCase().includes("added");
          const newAdmins = isAdding
            ? [...(c.Admins || []), userIdToMakeAdmin]
            : (c.Admins || []).filter((id) => id !== userIdToMakeAdmin);

          return { ...c, Admins: newAdmins };
        })
      );
    } catch (err) {
      console.error("❌ makeAdmin error:", err);
      const msg = err.response?.data?.message || "Failed to update admin role.";
      showAlert(msg);
    }
    };
    
      const updateCommunityRules = async (id, rules) => {
        try {
          const res = await axios.put(
            `${process.env.NEXT_PUBLIC_BACK_URL}/api/community/rules/${id}`,
            { rules },
            { headers }
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

  return {
    editCommunity,
    updateCommunityPicture,
    updateCommunityCover,
    removeMember,
      makeAdmin,
    updateCommunityRules
  };
};
