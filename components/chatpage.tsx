import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      }
    },
    hover: { 
      scale: 1,
      boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        variants={bubbleVariants}
        transition={{ duration: 0.5, delay: index * 0.1 }}
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
                ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white mr-2"
                : "bg-gradient-to-r from-gray-600 to-gray-800 text-gray-200 ml-2"
            } shadow-lg`}
            variants={bubbleVariants}
            whileHover="hover"
            // whileTap={{ scale: 0.98 }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {message.text}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
