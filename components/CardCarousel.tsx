import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { CardComponent } from "./home";
import Image from "next/image";
import Logo from "@/public/png/logo-no-background.png";
import Typewriter from "typewriter-effect";
import local from "@/public/png/logo-black.png";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.div 
      className="flex gap-12 items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="relative bg-[#34343677] w-full max-w-[35rem] h-[21rem]"
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
                    className="mt-32 mx-auto"
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
                <motion.div 
                  className="text-[#caccce]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Typewriter
                    onInit={(t: any) => {
                      t.typeString(robotText)
                        .callFunction(() => {
                          setShowCard(true);
                        })
                        .start();
                    }}
                  />
                </motion.div>
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
      <motion.div 
        className="relative lg:hidden xl:block hidden bg-[#34343677] w-full max-w-[30rem] h-80"
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
                    className="mt-32 mx-auto"
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
                <motion.div 
                  className="text-[#caccce]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Typewriter
                    onInit={(t) => {
                      t.typeString(robotText)
                        .callFunction(() => {
                          setShowCard(true);
                        })
                        .start();
                    }}
                  />
                </motion.div>
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
    </motion.div>
  );
};
