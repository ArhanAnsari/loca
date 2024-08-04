import { CardCarousel } from "./CardCarousel";
import { motion } from "framer-motion";

export const DefaultChatPage = ({ user }: { user: string }) => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div 
        className="text-[#c4c7c556] lg:text-6xl text-4xl font-semibold flex flex-col"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h1 
          className="bg-clip-text text-transparent bg-gradient-to-r from-[#4b90ff] from-1% via-blue-600 via-5% to-15% to-[#ff5546]"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          Hello {user}
        </motion.h1>
        <motion.p
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        >
          What can I find for you today?
        </motion.p>
      </motion.div>
      <motion.div 
        className="mt-20 lg:pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <CardCarousel />
      </motion.div>
    </motion.main>
  );
};
