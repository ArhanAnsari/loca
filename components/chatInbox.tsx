import { SendHorizontalIcon } from "lucide-react";
import { motion } from 'framer-motion';

export const ChatInbox: React.FC<ChatInboxProps> = ({
  textareaRef,
  userMessage,
  handleInput,
  isProcessing,
  handleSendMessage,
  locationError,
}) => {
  return (
    <motion.div
      className="border-t border-gray-700  p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {locationError && (
        <motion.div
          className="mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-red-500 text-sm">{locationError}</p>
        </motion.div>
      )}
      <div className="flex items-center gap-2">
        <motion.textarea
          ref={textareaRef}
          value={userMessage}
          onChange={handleInput}
          onKeyPress={(e) => e.key === "Enter" && !isProcessing && handleSendMessage()}
          className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 outline-none resize-none"
          placeholder={isProcessing ? "Processing..." : "Looking for local service provider?"}
          disabled={isProcessing}
          rows={1}
          style={{ maxHeight: "6rem" }}
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        />
        <motion.button
          className={`text-white p-2 rounded-full ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          onClick={() => !isProcessing && handleSendMessage()}
          disabled={isProcessing}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <SendHorizontalIcon className="w-5 h-5" />
        </motion.button>
      </div>
      <motion.p
        className="text-gray-400 text-xs text-center mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <b>LOCA</b> uses your input to fetch services. Keep your input brief for more accurate results.
      </motion.p>
    </motion.div>
  );
}