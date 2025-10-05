import { createContext, useContext, useState } from "react";
import axios from "axios";

const TranslateContext = createContext();

export const TranslateContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const translate = async (text, targetLang = "ar") => {
    if (!text) return "";
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/translate", {
        text,
        targetLang,
      });
      return res.data.translatedText;
    } catch (err) {
      console.error(err);
      return text;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TranslateContext.Provider value={{ translate, loading }}>
      {children}
    </TranslateContext.Provider>
  );
};

export const useTranslate = () => useContext(TranslateContext);
