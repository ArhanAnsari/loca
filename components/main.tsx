"use client";
import React, { ChangeEvent, useRef } from "react";
import { auth } from "@/lib/firebase";
import local from "@/public/png/logo-black.png";
import { useEffect, useState } from "react";
import Logo from "@/public/png/logo-no-background.png";
import { onAuthStateChanged } from "firebase/auth";
import { SkeletonCard } from "./loading";
import ReactMarkdown from "react-markdown";
import ViewMore from "./viewmore";

import { DefaultChatPage } from "./Deafultchatpage";
import { ChatPage } from "./chatpage";
import { ChatInbox } from "./chatInbox";
import { LocalServiceCard } from "./LocalServiceCard";

interface Location {
  latitude: number | null;
  longitude: number | null;
}

interface ConversationItem {
  sender: "user" | "AI";
  text: string | React.ReactNode;
}

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
  const [streamedResponse, setStreamedResponse] = useState<string>("");
  const [services, setServices] = useState<ServiceItem[]>([]);

  const conversationEndRef = useRef<HTMLDivElement>(null);

  const getLocationMap = location;

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
              `Unable to get your location. Please ensure location services are enabled.`,
            );
          },
          { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true },
        );
      } else {
        setLocationError(
          "Geolocation is not supported by this browser. Please enter your location manually",
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
      setLocationError("Please enter a location.");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          manualLocation,
        )}&key=${process.env.GOOGLE_PLACES_API_KEY}`,
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setLocation({ latitude: lat, longitude: lng });
        setLocationError(null);
      } else {
        setLocationError(
          "Unable to find the location. Please try a more specific address.",
        );
      }
    } catch (error) {
      console.error("Error geocoding manual location:", error);
      setLocationError(
        "Error processing location. Please try again or use a different address.",
      );
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
    if (userMessage.length > 500) {
      setLocationError(
        "Input is too long. Please keep your message under 500 characters.",
      );
      return;
    }
    setIsProcessing(true);
    if (!location.latitude || !location.longitude) {
      const locationSubmitted = await handleManualLocationSubmit();
      // @ts-ignore
      if (!locationSubmitted) {
        setIsProcessing(false);
        return;
      }
    }

    const newConversation: ConversationItem[] = [
      ...conversation,
      { sender: "user", text: userMessage },
    ];
    setConversation(newConversation);
    setUserMessage("");
    setIsLoading(true);
    setStreamedResponse("");
    setServices([]);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userMessage,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      let aiResponseText = "";
      let receivedServices: ServiceItem[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        const messages = chunk.split("\n").filter(Boolean);
        for (const message of messages) {
          try {
            const parsedMessage = JSON.parse(message);
            switch (parsedMessage.type) {
              case "services":
                receivedServices = parsedMessage.data;
                setServices(receivedServices);
                break;
              case "text":
                aiResponseText += parsedMessage.data;
                setStreamedResponse((prev) => prev + parsedMessage.data);
                break;
              case "error":
                throw new Error(parsedMessage.data);
            }
          } catch (e) {
            console.error("Error parsing message:", e);
          }
        }
      }

      const formattedResponse = <ReactMarkdown>{aiResponseText}</ReactMarkdown>;

      let aiResponse: React.ReactNode = (
        <div>
          {formattedResponse}
          {receivedServices && receivedServices.length > 0 && (
            <div className="mt-4 w-full">
              <article className="flex gap-2">
                Check this out or <ViewMore data={receivedServices.slice(2)} />
              </article>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                {receivedServices.slice(0, 2).map((service: ServiceItem) => (
                  <LocalServiceCard
                    key={service.place_id}
                    name={service.name}
                    address={service.address}
                    rating={service.rating}
                    user_ratings_total={service.user_ratings_total}
                    place_id={service.place_id}
                    phone_number={service.phone_number || "Not available"}
                    website={service.website || "Not available"}
                    email={service.email || "Not available"}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );

      setConversation([...newConversation, { sender: "AI", text: aiResponse }]);
    } catch (error: any) {
      console.error("Error sending message:", error.message);
      let errorMessage =
        "Sorry, an error occurred while processing your request.";
      setConversation([
        ...newConversation,
        { sender: "AI", text: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
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
  <div className=" w-full block m-auto max-w-5xl h-full">
    <div className="">
      {conversation.length === 0 ? (
        <DefaultChatPage user={user?.displayName?.slice(0, 3) || "Dev"} />
      ) : (
        conversation.map((message, index) => (
          <ChatPage
            key={index}
            message={message}
            index={index}
            image={image}
            logo={Logo}
            isLoading={isLoading}
            conversationEndRef={conversationEndRef}
          />
        ))
      )}
      {isLoading && <SkeletonCard />}
      <div ref={conversationEndRef} />
    </div>
    {/* <div className="sticky bottom-0  bg-green-500 p-4"> */}
      <ChatInbox
        locationError={locationError}
        isProcessing={isProcessing}
        handleInput={handleInput}
        textareaRef={textareaRef}
        userMessage={userMessage}
        handleSendMessage={handleSendMessage}
        setManualLocation={setManualLocation}
        manualLocation={manualLocation}
      />
    {/* </div> */}
  </div>
);
};

export default Main;
