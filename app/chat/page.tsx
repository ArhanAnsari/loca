"use client";
import Main from "@/components/main";
import Sidebar from "@/components/sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import local from "@/public/png/logo-black.png";
import Image from "next/image";
import FirstVisitPopup from "@/components/firstvisitpopup";
import { SignOut } from "@/lib/signIn";
import { LogOut } from "lucide-react";
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
    <main className=" flex  bg-black">
      <FirstVisitPopup />
      <div className=" hidden lg:block">
        <Sidebar />
      </div>
      <div className=" bg-[#1212] flex-1 min-h-[100vh] pb-[15vh] relative ">
        <div className="flex flex-col max-h-[830px] overflow-y-scroll scroll-m-1">
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
                  className="flex gap-1 cursor-pointer  text-[#ccc] lg:hidden xl:flex"
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

          <div className="self-center max-w-[900px] m-auto h-screen px-4">
            <Main />
          </div>
        </div>
      </div>
    </main>
  );
}
