import React, { ChangeEvent, useRef } from "react";
import { auth } from "@/lib/firebase";
import { SignOut } from "@/lib/signIn";
import Image from "next/image";
import local from "@/public/png/logo-black.png";
import { useEffect, useState } from "react";
import Logo from "@/public/png/logo-no-background.png";
import { SendHorizontalIcon, LogOut, PlusIcon } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import axios, { AxiosResponse } from "axios";
import { SkeletonCard } from "./loading";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import ViewMore from "./viewmore";
import { LocalServiceCard } from "./LocalServiceCard";
import { CardCarousel } from "./CardCarousel";

type Location = {
  latitude: number | null;
  longitude: number | null;
};

const Main: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [userMessage, setUserMessage] = useState("");
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualLocation, setManualLocation] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    // Getting location automatically
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            setLocation({
              latitude: position.coords.latitude || null,
              longitude: position.coords.longitude || null,
            });
            setLocationError(null);
          },
          (error: GeolocationPositionError) => {
            console.error("Error getting geolocation:", error.message);
            setLocationError(
              `Unable to get your location. Please ensure location services are enabled.`
            );
          },
          { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true }
        );
      } else {
        setLocationError(
          "Geolocation is not supported by this browser. Please enter your location manually"
        );
      }
    };

    getLocation();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // handler for manual location if error occur on automatic location
  const handleManualLocationSubmit = async () => {
    if (!manualLocation.trim()) {
      setLocationError("please enter a location.");
      return false;
    }

    setIsProcessing(true);
    try {
      const res: AxiosResponse<any, any> = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          manualLocation
        )}&key=${process.env.GOOGLE_PLACES_API_KEY}`
      );

      if (res.data.results && res.data.results.length > 0) {
        const { lat, lag } = res.data.result[0].geometry.location;
        setLocation({ latitude: lat, longitude: lag });
        setLocationError(null);
        return true;
      } else {
        setLocationError(
          "Unable to find the location. Please try a more specific address."
        );
        return false;
      }
    } catch (error) {
      console.error("Error geocoding manual location:", error);
      setLocationError(
        "Error processing location. Please try again or use a different address"
      );
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // if(locationError){
  //   alert(locationError)
  // }
  // handler for sending message to the sever
  const handleSendMessage = async () => {
    if (!userMessage.trim() || isProcessing) return;
    setIsProcessing(true);
    if (!location.latitude || !location.longitude) {
      const locationSubmitted = await handleManualLocationSubmit();
      if (!locationSubmitted) {
        return;
      }
      return;
    }

    const newConversation: ConversationItem[] = [
      ...conversation,
      { sender: "user", text: userMessage },
    ];
    setConversation(newConversation);
    setUserMessage("");
    setIsLoading(true);
    setIsProcessing(true);

    // If any error occur on server retry at least 3X
    const retryCount = 3;
    const baseTimeout = 20000;
    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        const response = await axios.post(
          "/api/gemini",
          {
            userMessage,
            latitude: location.latitude,
            longitude: location.longitude,
          },
          {
            headers: { "Content-Type": "application/json" },
            timeout: baseTimeout * (attempt + 1), // Increase timeout with each retry
          }
        );

        const data = response.data;
        if (data.error) {
          console.log(data.error);
          throw new Error(data.error);
        }

        let formattedResponse = (
          <ReactMarkdown>{data.vertexResponse}</ReactMarkdown>
        );

        // Combine AI response and service information
        let aiResponse: React.ReactNode = (
          <div>
            {formattedResponse}
            {data.services && data.services.length > 0 && (
              <div className="mt-4 w-full">
                <article className="flex gap-2">
                  Check this out or <ViewMore data={data.services.slice(2)} />
                </article>

                {data.services && (
                  <div className="w-full grid grid-rows-2">
                    {data.services.slice(0, 2).map((service: ServiceItem) => (
                      <LocalServiceCard
                        key={service.place_id}
                        name={service.name}
                        address={service.address}
                        rating={service.rating}
                        user_ratings_total={service.user_ratings_total}
                        place_id={service.place_id}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );

        // Display AI response
        setConversation([
          ...newConversation,
          { sender: "AI", text: aiResponse },
        ]);

        setIsLoading(false);
        return; // Success, exit the retry loop
      } catch (error: any) {
        console.error(
          `Error sending message (attempt ${attempt + 1}):`,
          error.message
        );

        if (attempt === retryCount - 1) {
          // This was the last attempt
          let errorMessage =
            "Sorry, an error occurred while processing your request.";
          if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
            errorMessage = `The request is taking longer than expected. Please try again later., ${
              (axios.isAxiosError(error), error.message)
            }`;
          }
          setConversation([
            ...newConversation,
            { sender: "AI", text: errorMessage },
          ]);
          setIsLoading(false);
        } else {
          // Wait before the next retry
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } finally {
        setIsLoading(false);
        setIsProcessing(false);
      }
    }
  };

  const image = user?.photoURL || local;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [userMessage]);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(e.target.value);
  };
  return (
    <main className="flex flex-col overflow-auto">
      {/* center  */}
      <header className="w-full max-w-4xl h-full max-h-[51rem] pb-20">
        <div className="text-white flex-1 flex-col gap-12  px-6 ">
          {conversation.length === 0 ? (
            <>
              <div className="text-[#c4c7c556] lg:text-6xl text-4xl font-semibold flex flex-col self-auto">
                <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-[#4b90ff] from-1% via-blue-600 via-5% to-15% to-[#ff5546]">
                  Hello {user?.displayName?.slice(0, 3) || "Dev"}
                </h1>
                <p>What can I find for you today?</p>
              </div>
              <div className="mt-20">
                <CardCarousel />
              </div>
            </>
          ) : (
            conversation.map((message, index) => (
              <div
                key={index}
                className="flex flex-col lg:flex-row lg:items-center gap-4  mb-8"
              >
                <Image
                  src={message.sender === "user" ? image : Logo}
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
            ))
          )}

          {isLoading && <SkeletonCard />}
        </div>
        {/* footer */}
      </header>
      <div className=" fixed  bg-black/80  bottom-0 w-full self-center max-w-[63rem] p-4">
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
        <div className="relative flex items-center gap-2 w-full rounded-md bg-[#1e1f20] p-3">
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
      </div>
      <div
        className="flex gap-2 cursor-pointer absolute top-6 right-28 text-[#ccc] lg:hidden"
        onClick={SignOut}
      >
        <LogOut />
        <span className="animate-fadeIn xs:hidden">LogOut</span>
      </div>
    </main>
  );
};

export default Main;
