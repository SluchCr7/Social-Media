'use client';
import Aside from "./Component/Aside";
import MainApp from "./Component/MainApp";
import Menu from "./Component/Menu";
import { useAuth } from "./Context/AuthContext";
import { useEffect, useState } from "react";
import Loader from "./Component/Loader";

export default function Home() {
  const { isLogin, user } = useAuth();
  // const [loading, setLoading] = useState(true); // Start as true initially

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setLoading(false);
  //   }, 2000); // Show loader for 2 seconds (or shorter)

  //   return () => clearTimeout(timeout); // Cleanup
  // }, []);

  // if (loading) return <Loader />;
  return (
    <div className="flex items-start gap-3 w-full">
      <MainApp />
    </div>
  );
}
