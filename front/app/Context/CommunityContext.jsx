'use client'
import React, { useEffect } from 'react'
import { createContext } from 'react'
export const CommunityContext = createContext()
import { useState , useContext } from 'react'
import { toast , ToastContainer } from 'react-toastify'
import getData from '../utils/getData'
import axios from 'axios'
import { useAuth } from './AuthContext'
export const CommunityContextProvider = ({ children }) => {
    const [community, setCommunity] = useState([])
    const {user} = useAuth()
    useEffect(() => {
        getData('community' , setCommunity)
    }, [community])
    const addCommunity = async(Name , Category , description) => {
        await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/community/add`, { Name, Category, description }, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }).then((res) => {
            toast.success("Community Created successfully.");
        }).catch((err) => {
            console.log(err)
        })
    }
    const joinToCommunity = async(id) => {
        await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/community/join/${id}` , {} , {headers : {authorization : `Bearer ${user.token}`}}).then((res) => {
            toast.success(res.data.message);
        }).catch((err) => {
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
        <CommunityContext.Provider value={{community, setCommunity , addCommunity , joinToCommunity}}>
            {children}
        </CommunityContext.Provider>
      </>
  )
}

export const useCommunity = () => {
    return useContext(CommunityContext)
}