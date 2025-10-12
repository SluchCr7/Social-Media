import axios from "axios";
import { buildPostFormData } from "../utils/formDataBuilder";
import { checkUserStatus } from "@/app/utils/checkUserLog";

export const usePostManagement = ({ user, showAlert, setPosts,setIsLoadingPostCreated, setIsLoading }) => {

  const AddPost = async (
    content,
    images,
    Hashtags,
    communityId,
    mentions = [],
    scheduledAt = null,
    links = [] // ✅ دعم الروابط الجديدة
    ,privacy = "public"
  ) => {
    if (!checkUserStatus("Add Post", showAlert, user)) return;

    const formData = new FormData();
    formData.append("text", content);

    // ✅ رفع الصور
    images.forEach(img => formData.append("image", img.file));

    // ✅ إضافة الهاشتاقات
    Hashtags.forEach(tag => formData.append("Hashtags", tag));

    // ✅ المجتمع (community)
    if (communityId) formData.append("community", communityId);

    // ✅ mentions
    if (mentions.length > 0)
      formData.append("mentions", JSON.stringify(mentions));

    // ✅ جدولة النشر
    if (scheduledAt) formData.append("scheduledAt", scheduledAt);
    if (privacy) formData.append("privacy", privacy);
    // ✅ إضافة الروابط
    // (الروابط قد تكون array of strings أو array of {label, url})
    if (links.length > 0) {
      formData.append("links", JSON.stringify(links));
    }
    setIsLoadingPostCreated(true)
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newPost = res.data?.post || res.data;

      // ✅ لو البوست مجدول
      if (scheduledAt) {
        showAlert("✅ Post scheduled successfully.");
      } else {
        showAlert("✅ Post added successfully.");
        setPosts(prev => [newPost, ...prev]);
      }

    } catch (err) {
      const message = err?.response?.data?.message;
      showAlert(message || "❌ Failed to upload post.");
    }finally{
      setIsLoadingPostCreated(false)
    }
  };

    
    const editPost = async (
      id,
      { text, community, Hashtags, existingPhotos, newPhotos, mentions = [], links = [] }
    ) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
  
        // ✅ النص
        formData.append('text', text);
  
        // ✅ المجتمع
        if (community) formData.append('community', community);
  
        // ✅ الهاشتاقات
        if (Hashtags && Hashtags.length > 0) {
          formData.append('Hashtags', JSON.stringify(Hashtags));
        }
  
        // ✅ الصور القديمة
        formData.append('existingPhotos', JSON.stringify(existingPhotos || []));
  
        // ✅ mentions
        if (mentions.length > 0)
          formData.append('mentions', JSON.stringify(mentions));
  
        // ✅ الصور الجديدة
        if (newPhotos && newPhotos.length > 0) {
          newPhotos.forEach(photo => {
            formData.append('newPhotos', photo);
          });
        }
  
        // ✅ الروابط
        if (links && links.length > 0) {
          formData.append('links', JSON.stringify(links));
        }
  
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/edit/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
  
        const updatedPost = res.data?.post || res.data;
        showAlert("✅ Post edited successfully.");
  
        // ✅ تحديث الحالة في الواجهة
        setPosts(prev =>
          prev.map(p =>
            p._id === id ? updatedPost : p
          )
        );
  
      } catch (err) {
        console.error(err);
        const message = err?.response?.data?.message;
        showAlert(message || "❌ Failed to edit the post.");
      } finally {
        setIsLoading(false);
      }
    };
    
  return { AddPost, editPost };
};
