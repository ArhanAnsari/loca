import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

export function SkeletonCard() {
  const skeletonVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      transition: { duration: 0.2 } 
    }
  };

  const shimmerEffect = {
    hidden: { x: "-100%" },
    visible: { 
      x: "100%",
      transition: { 
        repeat: Infinity, 
        duration: 1.5, 
        ease: "linear" 
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col space-y-4 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={skeletonVariants}
      >
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <Skeleton className="h-5 w-full max-w-[900px] rounded-full" />
              <motion.div
                className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-30"
                variants={shimmerEffect}
                initial="hidden"
                animate="visible"
              />
            </motion.div>
          ))}
        </div>
        <motion.div
          className="relative overflow-hidden"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Skeleton className="h-[150px] max-w-[900px] rounded-2xl" />
          <motion.div
            className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-30"
            variants={shimmerEffect}
            initial="hidden"
            animate="visible"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
