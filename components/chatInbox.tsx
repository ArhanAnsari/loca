import { SendHorizontalIcon } from "lucide-react";

export const ChatInbox: React.FC<ChatInboxProps> = ({
  textareaRef,
  userMessage,
  handleInput,
  isProcessing,
  handleSendMessage,
  locationError,
}) => {
  return (
    <div className="border-t border-gray-700 w-full max-w-5xl p-4">
      {locationError && (
        <div className="mb-2">
          <p className="text-red-500 text-sm">{locationError}</p>
        </div>
      )}
      <div className="flex items-center gap-2">
        <textarea
          ref={textareaRef}
          value={userMessage}
          onChange={handleInput}
          onKeyPress={(e) => e.key === "Enter" && !isProcessing && handleSendMessage()}
          className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 outline-none resize-none"
          placeholder={isProcessing ? "Processing..." : "Looking for local service provider?"}
          disabled={isProcessing}
          rows={1}
          style={{ maxHeight: "6rem" }}
        />
        <button
          className={`text-white p-2 rounded-full ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          onClick={() => !isProcessing && handleSendMessage()}
          disabled={isProcessing}
        >
          <SendHorizontalIcon className="w-5 h-5" />
        </button>
      </div>
      <p className="text-gray-400 text-xs text-center mt-2">
        <b>LOCA</b> uses your input to fetch services. Keep your input brief for more accurate results.
      </p>
    </div>
  );
};