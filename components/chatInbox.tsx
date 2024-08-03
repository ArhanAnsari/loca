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
       <main className="relative mt-2  bg-red-400 "> {/* Adjust positioning */}
      <div className="px-3 w-full max-w-5xl mx-auto fixed bottom-0 left-0 right-0 bg-black "> 
        {locationError && (
          <div className="mb-2">
            <p className="text-red-500 mb-1">{locationError}</p>
          </div>
        )}
        <div className="relative  flex items-center gap-2 w-full rounded-md bg-[#1e1f20] p-3">
          <textarea
            ref={textareaRef}
            value={userMessage}
            onChange={handleInput}
            onKeyPress={(e) =>
              e.key === "Enter" && !isProcessing && handleSendMessage()
            }
            className="flex-1 rounded-full bg-[#1e1f20] text-[#ccc] p-2 px-4 outline-none cursor-text text-md resize-none overflow-auto max-h-[6rem]"
            placeholder={`Looking for local service provider? ${
              isProcessing ? "processing...." : ""
            }`}
            disabled={isProcessing}
            rows={1}
            style={{ maxHeight: "6rem" }} // Adjust this value as needed
          />
          <SendHorizontalIcon
            className={`text-[#ccc] cursor-pointer ${
              isProcessing ? "opacity-50" : ""
            }`}
            onClick={() => !isProcessing && handleSendMessage()}
          />
        </div>
        <p className="text-[#ccc] text-xs text-center mt-2">
          <b>LOCA</b> uses your input to fetch services. Keep your input brief
          for more accurate results.
        </p>
      </div>
    </main>
  );
};