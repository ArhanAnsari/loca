"use client";
import Main from "@/components/main";
import Sidebar from "@/components/sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import local from "@/public/png/logo-black.png";
import Image from "next/image";
import FirstVisitPopup from "@/components/firstvisitpopup";
export default function Chat() {
  const [user, setUser] = useState(auth.currentUser);
  const image = user?.photoURL || local;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  });
  return (
    <main className=" flex h-screen   w-[100%]  bg-black">
      <FirstVisitPopup />
      <div className=" hidden lg:block">
        <Sidebar />
      </div>
      <div className=" bg-[#1212] h-screen flex-1">
        <div className="flex flex-col">
          <nav className="flex justify-between  p-4">
            <span
              className="text-[#caccce] font-medium text-3xl cursor-pointer"
              onClick={() => (window.location.href = "/")}
            >
              Loca
            </span>
            <Image
              src={image}
              alt="user"
              className="rounded-full"
              width={50}
              height={50}
            />
          </nav>
          <div className="self-center">
            <Main />
          </div>
        </div>
      </div>
    </main>
  );
}
