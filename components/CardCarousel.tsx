import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { CardComponent } from "./home"
import Image from "next/image";
import Logo from "@/public/png/logo-no-background.png";
import Typewriter from "typewriter-effect";
import local from "@/public/png/logo-black.png";
export const CardCarousel = () => {
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
      <div className="flex gap-12 items-center justify-center">
        <div className="relative  bg-[#34343677] w-full max-w-[35rem] h-[21rem]">
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
                  <div className="mt-32 mx-auto">
                    <h1 className="animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-red-600 text-6xl">
                      Loca AI
                    </h1>
                  </div>
                )}
                {showResponse && (
                  <div className="text-[#caccce]">
                    <Typewriter
                      onInit={(t:any) => {
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
                  <div className="mt-32 mx-auto">
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