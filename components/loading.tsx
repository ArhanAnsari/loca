import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function SkeletonCard() {
  const skeletonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="flex flex-col space-y-3"
      initial="hidden"
      animate="visible"
      variants={skeletonVariants}
      transition={{ duration: 8 }}
    >
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Skeleton className="h-4 w-full max-w-[900px]" />
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Skeleton className="h-[125px] max-w-[900px] rounded-xl" />
      </motion.div>
    </motion.div>
  );
}
