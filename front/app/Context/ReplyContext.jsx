'use client'
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
export const ReplyContext = createContext();
import { toast , ToastContainer } from "react-toastify";
import getData from "../utils/getData";
import { useAuth } from "./AuthContext";
export const ReplyContextProvider = ({ children }) => {
    const [replies, setReplies] = useState([])
    const {user} = useAuth()
    useEffect(() => { 
        getData('reply' , setReplies)
    }, [])
    const AddReply = async (text, comment) => {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACK_URL}/api/reply/add/${comment}`,
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
        }
      };      
    const deleteReply = async (id) => {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/api/reply/${id}` , {headers : {authorization : `Bearer ${user.token}`}})
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
        <ReplyContext.Provider value={{
            replies , setReplies , AddReply , deleteReply
        }}>
        {children}
        </ReplyContext.Provider>
        </>
    );
};

export const useReply = () => {
    return useContext(ReplyContext)
}