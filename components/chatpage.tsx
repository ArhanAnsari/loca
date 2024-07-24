import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Image from "next/image";
export const ChatPage: React.FC<ChatPageProps> = ({
    message,
    index,
    image,
    logo,
    isLoading,
  
    conversationEndRef,
  }) => {
    return (
      <ScrollArea className="">
        <main className=" w-full max-w-[900px] m-auto">
          <div
            key={index}
            className="flex flex-col lg:flex-row lg:items-center gap-4  mb-8"
          >
            <Image
              src={message.sender === "user" ? image : logo}
              alt={message.sender === "user" ? "user" : "Loca AI image"}
              width={50}
              height={50}
              className={cn(
                message.sender === "user" ? "" : "",
                "self-start rounded-full"
              )}
            />
            <p className="text-white " onCopy={(e) => !!e}>
              {message.text}
            </p>
            <div ref={conversationEndRef} />
          </div>
          {/* 
          {isLoading && <SkeletonCard />} */}
        </main>
      </ScrollArea>
    );
  };