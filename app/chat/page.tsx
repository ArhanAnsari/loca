"use client"
import Main from "@/components/main";
import Sidebar from "@/components/sidebar";

export default function Chat() {
    return (
        <main className="flex bg-black h-screen w-full ">
            <div className="h-full hidden lg:block">
            <Sidebar/>
            </div>
            <div className="w-full ">
                <Main/>
            </div>

        </main>
    );
}