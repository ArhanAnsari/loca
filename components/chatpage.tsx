import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Image from "next/image";
import { motion } from "framer-motion";
export const ChatPage: React.FC<ChatPageProps> = ({
  message,
  index,
  image,
  logo,
  isLoading,

  conversationEndRef,
}) => {
  const isUser = message.sender === "user";
  const bubbleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      initial="hidden"
      animate="visible"
      variants={bubbleVariants}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div
        className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} items-end max-w-[100%] lg:max-w-[80%]`}
      >
        <Image
          src={isUser ? image : logo}
          alt={isUser ? "user" : "Loca AI image"}
          width={40}
          height={40}
          className="rounded-full"
        />
        <motion.div
          className={`px-4 py-2 rounded-2xl ${
            isUser
              ? "bg-blue-700 text-white mr-2"
              : "bg-gray-600 text-black ml-2"
          }`}
          whileHover={{ scale: 1.03 }}
          // whileTap={{ scale: 0.95 }}
        >
          {message.text}
        </motion.div>
      </div>
    </motion.div>
  );
};
