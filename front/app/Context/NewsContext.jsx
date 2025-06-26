'use client'
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import getData from "../utils/getData";
export const NewsContext = createContext();

export const  NewsContextProvider = ({ children }) => {
    const [news, setNews] = useState([])
    useEffect(() => {
        const fetchAllNews = async () => {
            await axios.get(`http://localhost:3001/api/news`).then((res) => { 
                setNews(res.data.data)
            }).catch((err) => {
                console.log(err)
            })
        }
        fetchAllNews()
    }, [])
    return(
        <NewsContext.Provider value={{
            news
        }}> 
            {children}
        </NewsContext.Provider>
    )
};

export const useNews = () => {
    return useContext(NewsContext)
};