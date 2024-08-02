import { SendHorizontalIcon } from "lucide-react";

export const ChatInbox: React.FC<ChatInboxProps> = ({
  manualLocation,
  setManualLocation,
  textareaRef,
  userMessage,
  handleInput,
  isProcessing,
  handleSendMessage,
  locationError,
}) => {
  return (
    <main className="fixed bottom-0 py-4 px-4 left-[50%] right-[50%] transform -translate-x-1/2  shadow-2xl w-full max-w-max ">
      {/* footer */}
      <div className="">
        {locationError && (
          <div className="mb-2">
            <p className="text-red-500 mb-1">{locationError}</p>
            <input
              type="text"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              className="w-full max-w-4xl rounded-full h-10 bg-[#1e1f20] text-[#ccc] p-2 px-4 outline-none"
              placeholder="Enter your full location "
            />
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
            className="flex-1 rounded-full bg-[#1e1f20] text-[#ccc] p-2 outline-none cursor-text text-md resize-none overflow-auto max-h-[6rem]"
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
          <b>LOCA</b> use your input to fetch service. So long text will make
          <b>LOCA</b> response to be inaccurate so let your input be
          minimalistic to be able to get accurate services/response{" "}
        </p>
      </div>
    </main>
  );
};
