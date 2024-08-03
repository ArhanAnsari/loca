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
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserData {
  name?: string;
  email?: string;
  photoURL?: string;
}
export default function Chat() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-white ml-4 text-xl">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return router.push("/"); 
  }
  // @ts-ignore
  const image = user?.photoURL as string;
  return (
    <main className=" flex  bg-black h-[100vh] ">
      <FirstVisitPopup />
      <div className=" hidden lg:block">
        <Sidebar />
      </div>
      <div className=" bg-[#1212] min-h-[100vh] pb-[15vh] relative flex-1 ">
        <div className="flex flex-col max-h-[830px] overflow-y-auto scroll-m-1">
          <div className="sticky  z-10 top-0 w-full shadow-2xl bg-black">
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

          <div className="h-screen px-5 ">
            <Main />
          </div>
        </div>
      </div>
    </main>
  );
}
