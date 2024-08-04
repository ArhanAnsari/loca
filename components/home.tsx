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
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [showResponse, setShowResponse] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [text, setText] = useState(true);

  const [user, setUser] = useState(auth.currentUser);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        return null;
      }
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  let defaultName = "";
  const image = user?.photoURL || local;
  const robotText = `Hi ${!(user?.displayName === null)}, Yes! I found a great one nearby. Check it out and book now.`;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!showResponse) {
        setShowResponse(true);
        setText(false);
      }
    }, 9000);

    return () => clearTimeout(timer);
  }, [showResponse]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setSignInError(null);
    try {
      await SignIn();
    } catch (error) {
      setSignInError("Sign in failed. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.section
      className="bg-[#131314] w-full flex flex-col justify-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Navbar />
      <motion.header className="p-5 lg:p-5 lg:p-auto flex flex-col lg:flex-row justify-around items-center h-[55rem]" variants={itemVariants}>
        <motion.div
          className="relative lg:hidden block bg-[#34343677] w-full max-w-[30rem] h-[21rem]"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="p-4 rounded-lg">
            <div className="flex gap-2">
              <Image
                src={Logo}
                alt="Loca logo"
                width={50}
                height={50}
                className="flex self-start"
              />

              <div className="space-y-4">
                <AnimatePresence>
                  {!showResponse && text && (
                    <motion.div
                      className="mt-32 ml-10"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                    >
                      <h1 className="animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-red-600 text-6xl">
                        Loca AI
                      </h1>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                <AnimatePresence>
                  {showCard && <CardComponent />}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <motion.div
            className="flex gap-2 p-6 items-center absolute -bottom-14 right-0 bg-[#131314] rounded-lg"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
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
                    `<p className="text-[#caccce] font-semibold"> Hey <b>Loca</b>, any plumber near <br /> me in Texas</p>`,
                  )
                    .callFunction(() => {
                      setShowResponse(true);
                      setText(false);
                    })
                    .start();
                }}
              />
            </div>
          </motion.div>
        </motion.div>
        <motion.div className="space-y-6" variants={itemVariants}>
          <motion.h1
            className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-red-600 text-8xl lg:text-9xl"
            animate={{
              scale: [1, 1.1, 1],
              transition: { repeat: Infinity, duration: 2 }
            }}
          >
            Loca
          </motion.h1>
          <motion.span
            className="text-gray-300 font-black text-3xl lg:text-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Instantly connect with <br /> Local Expert
          </motion.span>
          <motion.p
            className="text-sm text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Chat to start finding local service providers like plumber,
            Furniture etc.{" "}
          </motion.p>

          {!user ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                onClick={handleSignIn}
                className="bg-blue-400 rounded-full p-6 hover:bg-blue-300"
                disabled={isSigningIn}
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              {signInError && (
                <p className="text-red-500 mt-2 text-sm">{signInError}</p>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button className="bg-blue-400 rounded-full p-6 hover:bg-blue-300">
                <Link href="/chat">Chat</Link>
              </Button>
            </motion.div>
          )}
        </motion.div>
        <motion.div
        className="relative lg:block hidden bg-[#34343677] w-full max-w-[30rem] h-80"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="p-4 rounded-lg">
            <div className="flex gap-2">
              <Image
                src={Logo}
                alt="Loca logo"
                width={50}
                height={50}
                className="flex self-start"
              />

              <div className="space-y-4">
                <AnimatePresence>
                  {!showResponse && text && (
                    <motion.div
                      className="mt-32 ml-10"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                    >
                      <h1 className="animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-red-600 text-6xl">
                        Loca AI
                      </h1>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                <AnimatePresence>
                  {showCard && <CardComponent />}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <motion.div
            className="flex gap-2 p-6 items-center absolute -bottom-14 right-0 bg-[#131314] rounded-lg"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
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
                    `<p className="text-[#caccce] font-semibold"> Hey <b>Loca</b>, any plumber near <br /> me in Texas</p>`,
                  )
                    .callFunction(() => {
                      setShowResponse(true);
                      setText(false);
                    })
                    .start();
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.header>
      <Footer />
    </motion.section>
  );
}

export const CardComponent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <ul className="border-[2px] border-[#caccce] border-dotted p-2 space-y-2">
        <motion.li
          className="text-white space-x-2"
          whileHover={{ scale: 1.05, originX: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-primary-foreground font-semibold">
            Plumber Name:
          </span>{" "}
          ABC plumbing
        </motion.li>
        <motion.li
          className="text-white"
          whileHover={{ scale: 1.05, originX: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-primary-foreground font-semibold">
            Address:
          </span>{" "}
          123 Main St, Texas
        </motion.li>
        <motion.li
          className="text-white"
          whileHover={{ scale: 1.05, originX: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-primary-foreground font-semibold">
            Contact:
          </span>{" "}
          (123) 456-789
        </motion.li>
      </ul>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button className="bg-blue-400 rounded-full p-6 hover:bg-blue-300 mt-2">
          Book Now{" "}
        </Button>
      </motion.div>
    </motion.div>
  );
};
