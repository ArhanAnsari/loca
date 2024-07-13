import {
  LogOut,
  MailQuestion,
  MenuIcon,
  MessageSquare,
  PlusIcon,
  Settings,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { SignOut } from "@/lib/signIn";

const Sidebar = () => {
  const [extend, setExtend] = useState(false);
  return (
    <aside
      className={cn(
        `bg-[#1e1f20] h-screen  ${
          extend ? "w-72 p-8" : "w-16 p-4 items-center"
        } flex flex-col justify-between transition-all duration-500 ease-in-out`
      )}
    >
      <div
        className={cn(
          `flex flex-col gap-10  ${
            extend ? "animate-extend" : "animate-collapse items-center"
          }`
        )}
      >
        <MenuIcon
          className="text-[#ccc] cursor-pointer font-extrabold"
          onClick={() => setExtend((e) => !e)}
        />

        <Button
          className={cn(
            `bg-[#cccccc80] text-[#fff] rounded-2xl shadow-inner hover:bg-gray-500 ${
              extend ? "w-24" : "w-12"
            } transition-all duration-500 ease-in-out`
          )}
        >
          <PlusIcon />
          {extend ? <span className="animate-fadeIn"> New chat</span> : null}
        </Button>
        {/* Recent */}
        {/* <div className="flex flex-col gap-4 ">
          {extend ? (
            <>
              <h4 className="text-[#cccc]">Recent</h4>
              <ul className="flex flex-col gap-1 text-[#ccc]">
                <li className="flex gap-2">
                  <MessageSquare />{" "}
                  <span className="animate-fadeIn">chat1</span>
                </li>
                <li className="flex gap-2">
                  <MessageSquare />{" "}
                  <span className="animate-fadeIn">chat2</span>
                </li>
                <li className="flex gap-2">
                  <MessageSquare />{" "}
                  <span className="animate-fadeIn">chat3</span>
                </li>
              </ul>
            </>
          ) : null}
        </div> */}
      </div>
      <div>
        <ul className="flex flex-col gap-4 text-[#ccc] ">
          <li className="flex gap-2">
            <MailQuestion />{" "}
            {extend ? <span className="animate-fadeIn">FAQ</span> : null}
          </li>

          <li className="flex gap-2 cursor-pointer" onClick={SignOut}>
            <LogOut />{" "}
            {extend ? <span className="animate-fadeIn">LogOut</span> : null}
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
