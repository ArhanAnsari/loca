"use client";
import Main from "@/components/main";
import Sidebar from "@/components/sidebar";
import { useEffect, useRef, useState } from "react";
import { auth } from "@/lib/firebase";
import local from "@/public/png/logo-black.png";
import Image from "next/image";
import FirstVisitPopup from "@/components/firstvisitpopup";
import { SignOut } from "@/lib/signIn";
import { LogOut, MenuIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from 'framer-motion';

interface UserData {
  name?: string;
  email?: string;
  photoURL?: string;
}

export default function Chat() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch("/api/verify-session");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            // Fetch user data from Firestore
            const userDoc = await getDoc(doc(db, "users", data.user.uid));
            if (userDoc.exists()) {
              setUser(userDoc.data() as UserData);
            } else {
              throw new Error("User document not found");
            }
          } else {
            throw new Error("Not authenticated");
          }
        } else {
          throw new Error("Failed to verify session");
        }
      } catch (error) {
        console.error("Error verifying session:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-white ml-4 text-xl">Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/");
    return null;
  }

  const image = user?.photoURL as string;

  return (
    <main className="flex h-screen bg-[#131314] overflow-hidden">
      <FirstVisitPopup />
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <nav className="flex justify-between  items-center p-4 sticky top-0 z-10">
          <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </button>
          <span className="text-[#caccce] font-medium text-3xl cursor-pointer items-center" onClick={() => window.location.href = "/"}>
            Loca
          </span>
          <div className="flex gap-6 items-center">
            <button className="lg:hidden text-[#ccc]" onClick={SignOut}>
              <LogOut />
            </button>
            <Image src={image} alt="user" className="rounded-full" width={50} height={50} />
          </div>
        </nav>
        <div className="flex-1 overflow-hidden">
          <Main />
        </div>
      </div>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-64 bg-[#1e1f20] z-50 lg:hidden"
          >
            <button
              className="absolute top-4 right-4 text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={24} />
            </button>
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}