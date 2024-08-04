"use client";
import { LogOut, MailQuestion, MenuIcon, MessageSquare, PlusIcon, SidebarCloseIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { SignOut } from "@/lib/signIn";
import Link from "next/link";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [extend, setExtend] = useState(false);



  function handleNewChat(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <aside
      className={cn(
        `bg-[#1e1f20] h-full inline-flex ${extend ? "w-60 p-8" : "w-16 p-4 items-center"
        } flex flex-col justify-between transition-all duration-500 ease-in-out`,
      )}
    >
      <div
        className={cn(
          `flex flex-col gap-10  ${extend ? "animate-extend" : "animate-collapse items-center"
          }`,
        )}
      >
        {extend ? (
          <SidebarCloseIcon
            onClick={() => {
              setExtend(false);
              onClose && onClose();
            }}
            className="text-[#ccc] cursor-pointer font-extrabold"
          />
        ) : (
          <MenuIcon
            className="text-[#ccc] cursor-pointer font-extrabold"
            onClick={() => setExtend(true)}
          />
        )}

        <Button
          className={cn(
            `bg-[#cccccc80] flex text-[#fff] rounded-2xl shadow-inner hover:bg-gray-500 ${extend ? "w-32" : "w-12"
            } transition-all duration-500 ease-in-out`,
          )}
          onClick={handleNewChat}
        >
          {/* <Link href="/chat" className="flex"> */}
          <PlusIcon />
          {extend ? <span className="animate-fadeIn"> New chat</span> : null}
          {/* </Link> */}
        </Button>
        {/* Recent */}
        <div className="flex flex-col gap-4 ">
          {extend ? (
            <>
              <h4 className="text-[#cccc] text-left truncate hover:bloc">
                Your successful Booking will be here
              </h4>
              {/* <ul className="flex flex-col gap-1 text-[#ccc]">
             
              </ul> */}
            </>
          ) : null}
        </div>
      </div>
      <div>
        <ul className="flex flex-col gap-4 text-[#ccc] ">
          <li>
            <Link href="/faq" className="flex gap-2 items-center">
              <MailQuestion />{" "}
              {extend ? <span className="animate-fadeIn">FAQ</span> : null}
            </Link>
          </li>

          <li
            className="flex gap-2 cursor-pointer"
            onClick={() => {
              SignOut();
              onClose && onClose();
            }}
          >
            <LogOut />{" "}
            {extend ? <span className="animate-fadeIn">LogOut</span> : null}
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
