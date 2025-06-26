'use client'
import { createContext, useContext, useEffect, useState } from "react";
export const ReplyReplyContext = createContext();
import { toast , ToastContainer } from "react-toastify";
import { useAuth } from "./AuthContext";
import getData from "../utils/getData";
import axios from "axios";
export const ReplyReplyContextProvider = ({ children }) => {
    const [repliesReply, setRepliesReply] = useState([])
  const { user } = useAuth()
    useEffect(() => {
        getData('reReply' , setRepliesReply)
    }, [repliesReply])
    // Add Function
    const AddReplyReply = async (text, replyId) => {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACK_URL}/api/reReply/add/${replyId}`,
            {
              text,
            },
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          toast.success("Reply added successfully.");
        } catch (err) {
          toast.error(err?.response?.data?.message || "Failed to upload Reply.");
          console.log(err)
        }
    }
    // Delete Function
    const deleteReplyReply = async (id) => {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/reReply/${id}` , {headers : {authorization : `Bearer ${user.token}`}})
            toast.success(res.data.message);
        } catch (err) {
            console.log(err)
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
        <ReplyReplyContext.Provider value={{
            repliesReply,
            setRepliesReply,
            AddReplyReply,
            deleteReplyReply
        }}>
            {children}
        </ReplyReplyContext.Provider>
        </>
    )
}

export const useReplyReply = () => {
    return useContext(ReplyReplyContext)
}