"use client";
import Image from "next/image";
import Navbar from "./navbar";
import { Button } from "./ui/button";
import Logo from "@/public/png/logo-no-background.png";
import User from "@/public/png/user.png";
import Typewriter from "typewriter-effect";
import Footer from "./footer";
import { useEffect, useState } from "react";
import local from "@/public/png/logo-black.png";
import { SignIn } from "@/lib/signIn";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function HomePage() {
  const [showResponse, setShowResponse] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [text, setText] = useState(true);

  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if(!currentUser){
        return null
      }
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);
    let defaultName = ""
    // const Check = !(user?.displayName === null) : defaultName
  const image = user?.photoURL || local;
  const robotText = `Hi ${!(user?.displayName === null ) }, Yes! I found a great one nearby. Check it out and book now.`
    // Function to simulate user typing
    useEffect(() => {
        const timer = setTimeout(() => {
          if (!showResponse) {
            setShowResponse(true);
            setText(false);
          }
        }, 9000); // Adjust this delay as needed
    
        return () => clearTimeout(timer);
      }, [showResponse]);


  return (
    <section className="bg-[#131314]  w-full flex flex-col justify-center">
      <Navbar />
      <header className="p-5 lg:p-5 lg:p-auto flex flex-col lg:flex-row justify-around items-center  h-[55rem] ">
      <div className="relative lg:hidden block bg-[#34343677] w-full max-w-[30rem] h-[21rem]">
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
              <div className="mt-32 ml-10">
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
              src={user ? image : User}
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
        <div className="space-y-6 ">
          <h1 className=" animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-red-600 text-8xl lg:text-9xl  ">
            Loca
          </h1>
          <span className="text-gray-300 font-black text-3xl lg:text-3xl">
            Instantly connect with <br /> Local Expert
          </span>
          <p className="text-sm text-white">
            Chat to start finding local service providers like plumber,
            Furniture etc.{" "}
          </p>
          
            {!user?(
              <Button onClick={SignIn} className="bg-blue-400 rounded-full p-6 hover:bg-blue-300">SignIn </Button>
            ):(
              <Button  className="bg-blue-400 rounded-full p-6 hover:bg-blue-300"> <Link href="/chat">Chat</Link>   </Button>
            )}
       
        </div>
        <div className="relative lg:block hidden bg-[#34343677] w-full max-w-[30rem] h-80">
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
                    t.typeString(
                      'Yes! I found a great one nearby. Check it out and book now.'
                    )
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
              src={User}
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
      </header>
      <Footer />
    </section>
  );
}

export const CardComponent = () => {
  return (
    <>
      <ul className="border-[2px] border-[#caccce] border-dotted p-2 space-y-2">
        <li className="text-white space-x-2">
          <span className="text-primary-foreground font-semibold">
            Plumber Name:
          </span>{" "}
          ABC plumbing
        </li>
        <li className="text-white">
          <span className="text-primary-foreground font-semibold">
            Address:
          </span>{" "}
          123 Main St, Texas
        </li>
        <li className="text-white">
          <span className="text-primary-foreground font-semibold">
            Contact:
          </span>{" "}
          (123) 456-789
        </li>
      </ul>
      <Button className="bg-blue-400 rounded-full p-6 hover:bg-blue-300">
        Book Now{" "}
      </Button>
    </>
  );
};
