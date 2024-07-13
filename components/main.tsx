import React from "react";
import { auth } from "@/lib/firebase";
import { SignOut } from "@/lib/signIn";
import Image from "next/image";
import local from "@/public/png/logo-black.png";
import Typewriter from "typewriter-effect";
import { useEffect, useState } from "react";
import Logo from "@/public/png/logo-no-background.png";
import { CardComponent } from "./home";
import { SendHorizontalIcon, LogOut, PlusIcon } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SkeletonCard } from "./loading";

interface Location {
  latitude: number | null;
  longitude: number | null;
}

interface ServiceItem {
  name: string;
  address: string;
  rating: number;
  user_ratings_total: number;
  place_id: string;
}

interface LocalServiceCardProps {
  name: string;
  address: string;
  rating: number;
  user_ratings_total: number;
  place_id: string;
}

type ConversationItem = {
  sender: string;
  text: React.ReactNode;
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

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setLocationError(null);
          },
          (error) => {
            console.error("Error getting geolocation:", error);
            setLocationError(
              `Unable to get your location. Please ensure location services are enabled.`
            );
          },
          { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true }
        );
      } else {
        setLocationError("Geolocation is not supported by this browser.");
      }
    };

    getLocation();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    if (!location.latitude || !location.longitude) {
      alert(
        "Location is not available. Please enable location services and try again."
      );
      return;
    }

    const newConversation = [
      ...conversation,
      { sender: "user", text: userMessage },
    ];
    setConversation(newConversation);
    setUserMessage("");
    setIsLoading(true);

    const retryCount = 3;
    const baseTimeout = 20000; // 20 seconds

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
          throw new Error(data.error);
        }

        // Combine AI response and service information
        let aiResponse: React.ReactNode = (
          <div>
            <p>{data.vertexResponse}</p>
            {data.services && data.services.length > 0 && (
              <div className="mt-4 w-full">
                <article>
                  Here are some local service providers that might help:
                </article>

                {data.services.map((service: ServiceItem, index: number) => (
                  <div key={index} className="w-full">
                    <LocalServiceCard
                      name={service.name}
                      address={service.address}
                      rating={service.rating}
                      user_ratings_total={service.user_ratings_total}
                      place_id={service.place_id}
                    />
                  </div>
                ))}
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
        console.error(`Error sending message (attempt ${attempt + 1}):`, error);

        if (attempt === retryCount - 1) {
          // This was the last attempt
          let errorMessage =
            "Sorry, an error occurred while processing your request.";
          if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
            errorMessage =
              "The request is taking longer than expected. Please try again later.";
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
      }
    }
  };

  const image = user?.photoURL || local;

  return (
    <main className="lg:p-4 flex-1 overflow-auto relative">
      {/* navbar */}
      <nav className="flex justify-between sticky p-4">
        <span className="text-[#caccce] font-medium text-3xl">Loca</span>
        <Image
          src={image}
          alt="user"
          className="rounded-full"
          width={50}
          height={50}
        />
      </nav>
      {/* center  */}
      <header className="max-w-[900px] m-auto h-[700px]">
        <div className="text-white flex flex-col gap-12 h-screen max-h-[800px]  overflow-auto px-6 scroll-smooth section">
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
              <div key={index} className="flex gap-4 items-center self-start">
                <Image
                  src={message.sender === "user" ? image : Logo}
                  alt={message.sender === "user" ? "user" : "Loca AI image"}
                  width={50}
                  height={50}
                  className="rounded-full self-start"
                />
                <p className="text-white" onCopy={(e) => !!e}>
                  {message.text}
                </p>
              </div>
            ))
          )}
          {isLoading && <SkeletonCard />}
        </div>
        {/* footer */}
        <div className="w-full lg:max-w-4xl xs:max-w-[25rem] sm:max-w-[35rem] p-5 fixed bottom-0 bg-black">
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
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="w-full max-w-4xl rounded-full h-16 bg-[#1e1f20] text-[#ccc] p-2 px-4 outline-none xs:hidden cursor-text"
            placeholder={`Hey ${user?.displayName}, looking for local service provider?`}
          />
          {/* <PlusIcon className="absolute text-[#ccc] left-8 bottom-4 cursor-pointer"/> */}
          <SendHorizontalIcon
            className="absolute text-[#ccc] right-9 bottom-10 cursor-pointer"
            onClick={handleSendMessage}
          />
        </div>
      </header>
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

const CardCarousel = () => {
  const [showResponse, setShowResponse] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [text, setText] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const image = user?.photoURL || local;
  const robotText = `Hi ${user?.displayName}, Yes! I found a great one nearby. Check it out and book now.`;
  return (
    <div className="flex gap-12 items-center">
      <div className="relative  bg-[#34343677] w-full max-w-[30rem] h-80">
        <div className=" p-4 rounded-lg">
          <div className="flex gap-2">
            <Image
              src={Logo}
              alt="Loca logo"
              width={50}
              height={50}
              className="flex self-start"
            />

            <div className="space-y-4">
              {!showResponse && text && (
                <div className="mt-32 ml-20">
                  <h1 className="animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-red-600 text-6xl">
                    Loca AI
                  </h1>
                </div>
              )}
              {showResponse && (
                <div className="text-[#caccce]">
                  <Typewriter
                    onInit={(t) => {
                      t.typeString(robotText)
                        .callFunction(() => {
                          setShowCard(true);
                        })
                        .start();
                    }}
                  />
                </div>
              )}
              {showCard && <CardComponent />}
            </div>
          </div>
        </div>
        <div className="flex gap-2 p-6 items-center absolute -bottom-14 right-0 bg-[#131314] rounded-lg">
          <Image
            src={image}
            alt="Loca logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div className="text-[#caccce] font-semibold">
            <Typewriter
              onInit={(t) => {
                t.typeString(
                  `<p className="text-[#caccce] font-semibold"> Hey <b>Loca</b>, any plumber near <br /> me in Texas</p>`
                )
                  // .pauseFor(2500)
                  .callFunction(() => {
                    setShowResponse(true);
                    setText(false);
                  })
                  .start();
              }}
            />
          </div>
        </div>
      </div>
      <div className="relative lg:hidden xl:block hidden  bg-[#34343677] w-full max-w-[30rem] h-80">
        <div className=" p-4 rounded-lg">
          <div className="flex gap-2">
            <Image
              src={Logo}
              alt="Loca logo"
              width={50}
              height={50}
              className="flex self-start"
            />

            <div className="space-y-4">
              {!showResponse && text && (
                <div className="mt-32 ml-20">
                  <h1 className="animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-red-600 text-6xl">
                    Loca AI
                  </h1>
                </div>
              )}
              {showResponse && (
                <div className="text-[#caccce]">
                  <Typewriter
                    onInit={(t) => {
                      t.typeString(robotText)
                        .callFunction(() => {
                          setShowCard(true);
                        })
                        .start();
                    }}
                  />
                </div>
              )}
              {showCard && <CardComponent />}
            </div>
          </div>
        </div>
        <div className="flex gap-2 p-6 items-center absolute -bottom-14 right-0 bg-[#131314] rounded-lg">
          <Image
            src={image}
            alt="Loca logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div className="text-[#caccce] font-semibold">
            <Typewriter
              onInit={(t) => {
                t.typeString(
                  `<p className="text-[#caccce] font-semibold"> Hey <b>Loca</b>, any plumber near <br /> me in Texas</p>`
                )
                  // .pauseFor(2500)
                  .callFunction(() => {
                    setShowResponse(true);
                    setText(false);
                  })
                  .start();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const LocalServiceCard: React.FC<LocalServiceCardProps> = ({
  name,
  address,
  rating,
  user_ratings_total,
  place_id,
}) => {
  return (
    <div className="  border-[2px] border-[#caccce] border-dotted p-4 space-y-2 mb-4 w-full max-w-[410px]">
      <h3 className="text-white font-semibold">{name}</h3>
      <p className="text-white">{address}</p>
      <p className="text-white">
        Rating: {rating} ({user_ratings_total} reviews)
      </p>
      <Link
        href={`https://www.google.com/maps/place/?q=place_id:${place_id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300"
      >
        View on Google Maps
      </Link>
    </div>
  );
};
