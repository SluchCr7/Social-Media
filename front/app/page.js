'use client';
import Aside from "./Component/Aside/Aside";
import MainApp from "./Component/MainApp";
import Menu from "./Component/Menus/Menu";
import { useAuth } from "./Context/AuthContext";
import { useEffect, useState } from "react";
import Loader from "./Component/Loader";

export default function Home() {
  return (
    <div className="flex items-start gap-3 w-full">
      <MainApp />
    </div>
  );
}
