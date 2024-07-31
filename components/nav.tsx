"use client"
import React from "react";
import Image from "next/image";
import { SignOut } from "@/lib/signIn";
import { LogOut } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import local from "@/public/png/logo-black.png";
export const Nav = () => {
  const [user, setUser] = useState(auth.currentUser);
  const image = user?.photoURL || local;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  });
  return (
    <div className="sticky top-0 w-full shadow-md">
      <nav className="flex justify-between  p-4 ">
        <span
          className="text-[#caccce] font-medium text-3xl cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          Loca
        </span>
        <div className="flex gap-6 items-center">
          <div
            className="flex gap-1 cursor-pointer  text-[#ccc] lg:hidden"
            onClick={SignOut}
          >
            <LogOut />
            <span className="animate-fadeIn xs:hidden">LogOut</span>
          </div>
          <Image
            src={image}
            alt="user"
            className="rounded-full"
            width={50}
            height={50}
          />
        </div>
      </nav>
    </div>
  );
};
