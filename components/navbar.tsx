import Link from "next/link";
import { Button } from "./ui/button";
import { SignIn } from "@/lib/signIn";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState(auth.currentUser);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if(!currentUser){
        return null
      }
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const redirectToChat = () => {
    window.location.href ="/chat"
    console.log("redirect to chat")
  }
  return (
    <div className="flex justify-between items-center p-5">
      <span className="text-[#caccce] font-medium text-2xl">Loca</span>
      <nav className="flex gap-4 items-center">
        <Link href={"/"} className="font-bold text-white">FAQ</Link>
        {!user?(
              <Button onClick={SignIn} className="bg-blue-400 rounded-full p-6 hover:bg-blue-300">SignIn </Button>
            ):(
              <Button  className="bg-blue-400 rounded-full p-6 hover:bg-blue-300 cursor-pointer"><Link href={'/chat'}>Chat</Link></Button>
            )}
      </nav>
    </div>
  );
}
