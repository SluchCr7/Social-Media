'use client'
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
export const CommentContext = createContext();
import { toast , ToastContainer } from "react-toastify";
import { useAuth } from "./AuthContext";
import getData from "../utils/getData";
import { useNotify } from "./NotifyContext";
export const CommentContextProvider = ({ children }) => {
    const [comments, setcomments] = useState([])
  const { user } = useAuth()
  const {AddNotify} = useNotify()
    useEffect(() => { 
        getData('comment' , setcomments)
    }, [comments])
    const AddComment = async (text, postId , userId) => {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/add/${postId}`,
            {
              text,
            },
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          toast.success("Comment added successfully.");
          AddNotify(`${user.username} Commented On Your Post` , userId);
        } catch (err) {
          toast.error(err?.response?.data?.message || "Failed to upload comment.");
        }
      };      
    const deleteComment = async (id) => {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/${id}` , {headers : {authorization : `Bearer ${user.token}`}})
          toast.success(res.data.message);
        } catch (err) {
            console.log(err)
        }
    }
    const updateComment = async (id , text) => {
        try {
            const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/update/${id}` , {text} , {headers : {authorization : `Bearer ${user.token}`}}) 
            toast.success("Comment updated successfully.");
        } catch (err) {
            console.log(err)
        }
    }
    const likeComment = async(id)=>{
        await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/comment/like/${id}` , {} , {headers : {authorization : `Bearer ${user.token}`}})
        .then((res) => {
          toast.success(res.data.message);
        })
        .catch((err) => {
            console.log(err)
        })
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
        <CommentContext.Provider value={{
            comments,
            setcomments,
            AddComment,
            deleteComment, 
            likeComment
        }}>
        {children}
        </CommentContext.Provider>
        </>
    );
};

export const useComment = () => {
    return useContext(CommentContext)
}