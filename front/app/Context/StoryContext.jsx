'use client'
import { createContext, useContext, useEffect , useState } from "react";
export const storyContext = createContext()
import { toast , ToastContainer } from "react-toastify";
import getData from "../utils/getData";
import axios from "axios";
import { useAuth } from "./AuthContext";

export const StoryContextProvider = ({ children }) => {
    const {user} = useAuth()
    const [stories , setStories ] = useState([])
    const addNewStory = async (storyData) => {
        const formData = new FormData()
        if (storyData.type === 'image' && storyData.file) {
          formData.append('image', storyData.file)
        } else if (storyData.type === 'text' && storyData.text) {
          formData.append('text', storyData.text)
        } else {
          toast.error("You must provide either an image or text for the story.")
          return
        }
      
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACK_URL}/api/story/add`,
            formData,
            {
              headers: {
                authorization: `Bearer ${user.token}`,
              },
            }
          )
          toast.success("Story added successfully.")
        } catch (err) {
          console.error(err)
          toast.error("Failed to add story.")
        }
    }
    useEffect(()=> {
        getData('story' , setStories)
    },[stories])
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
            <storyContext.Provider value={{
                addNewStory, stories
            }}>
                {children}
            </storyContext.Provider>
        </>
    )
}

export const useStory = () => {
    return useContext(storyContext)
}