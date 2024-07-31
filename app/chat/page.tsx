"use client";
import Main from "@/components/main";
import FirstVisitPopup from "@/components/firstvisitpopup";
export default function Chat() {
  return (
    <main className="  bg-black">
      <FirstVisitPopup />
      <div className=" bg-[#1212] min-h-[100vh] pb-[15vh] relative ">
        <div className="flex flex-col max-h-[830px] overflow-y-scroll scroll-m-1">
          <div className="self-center max-w-[900px] m-auto h-screen px-4">
            <Main />
          </div>
        </div>
      </div>
    </main>
  );
}
