'use client'
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
export const PostContext = createContext();
import { toast , ToastContainer } from "react-toastify";
import { useAuth } from "./AuthContext";
import getData from "../utils/getData";
export const PostContextProvider = ({ children }) => {
    const [posts, setPosts] = useState([])
    const {user} = useAuth()
    useEffect(() => { 
        getData('post' , setPosts)
    }, [posts])
    const AddPost = async (content, images , Hashtags , communityId) => {
        const formData = new FormData();
        formData.append('text', content);
        for (let i = 0; i < images.length; i++) {
            formData.append('image', images[i]); // 'image' must match what the backend expects
        }
        for (let i = 0 ; i < Hashtags.length ; i++) {
            formData.append('Hashtags', Hashtags[i]); // 'Hashtags' must match what the backend expects
        }
        if (communityId) {
            formData.append('community', communityId); // 'communityId' must match what the backend expects
        }
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/add`,
                formData, // ✅ send FormData directly
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'multipart/form-data', // ✅ correct content type
                    },
                }
            );
            toast.success("Post added successfully.");
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to upload post.");
        }
    };
    
    const deletePost = async (id) => {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post/${id}` , {headers : {authorization : `Bearer ${user.token}`}})
            toast.success(res.data.message);
            window.location.href = "/"
        } catch (err) {
            console.log(err)
        }
    }
    const likePost = async (id) => {
        await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post/like/${id}` , {} , {headers : {authorization : `Bearer ${user.token}`}})
        .then((res) => {
            toast.success(res.data.message);
        })
            .catch((err) => {
            console.log(err)
        })
    }
    const savePost = async (id) => {
        await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/post/save/${id}` , {} , {headers : {authorization : `Bearer ${user.token}`}})
        .then((res) => {
            toast.success("Post saved successfully.");
        })
            .catch((err) => {
            console.log(err)
        })
    }
    const sharePost = async (id) => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACK_URL}/api/post/share/${id}`, 
                {}, // هذا هو الـ body، فارغ هنا
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }                      
                }
            );
            toast.success("Post shared successfully.");
        } catch (err) {
            console.log(err);
            toast.error("Failed to share the post.");
        }
    }
    return (
        <>
        <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            className="custom-toast-container"
            toastClassName="custom-toast"
        />
        <PostContext.Provider value={{
            posts,
            AddPost,
                deletePost,
                likePost, 
                savePost,
                sharePost
        }}>
        {children}
        </PostContext.Provider>
        </>
    );
};

export const usePost = () => {
    return useContext(PostContext)
}