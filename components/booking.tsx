"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@custom-react-hooks/all";
import { useClipboard } from "@mantine/hooks";
import { CopyCheckIcon, CopyIcon, CopyleftIcon } from "lucide-react";
import Link from "next/link";
import { BookingForm } from "./bookingForm";

export function Booking({
  mapLink,
  locationName,
  providerName,
  providerEmail,
  providerWebsite,
  providerPhone,
}: {
  mapLink: string;
  locationName: string;
  providerName: string;
  providerEmail?: string;
  providerPhone?: string;
  providerWebsite?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [mapError, setMapError] = React.useState(false);
  const clipboard = useClipboard({ timeout: 500 });
  React.useEffect(() => {
    // Reset error state when mapLink changes
    setMapError(false);
  }, [mapLink]);

  const handleMapError = () => {
    setMapError(true);
  };

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-blue-400 rounded-full p-6 hover:bg-blue-300 text-black border-none outline-none">
            Book Now
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-[#1e1f20] border-none text-white">
          <DialogHeader>
            <DialogTitle>Contact {providerName}</DialogTitle>
            <DialogDescription>
              We provide a few options for you to book
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col ">
            <div className="">
              <div className=" grid grid-cols-2 ">
                <div>
                  <Label htmlFor="link" className="text-center">
                    phone number
                  </Label>
                  <div className="relative">
                    <Input
                      id="link"
                      defaultValue={providerPhone || "no phone number"}
                      readOnly
                      // disabled
                      className="relative hover:border-none bg-white/15 border-none outline-none rounded-tl-2xl "
                    />
                    <div className="absolute bottom-2 text-md  right-4">
                      {clipboard.copied ? (
                        <CopyCheckIcon />
                      ) : (
                        <CopyIcon
                          onClick={() => clipboard.copy(providerPhone)}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="link" className="text-center">
                    website
                  </Label>
                  <div className="relative">
                    <Input
                      id="link"
                      defaultValue={providerEmail || "No website provided"}
                      readOnly
                      disabled
                      className="relative outline-none bg-white/15 border-none  rounded-tr-2xl"
                    />
                    <div className="absolute bottom-2 right-4">
                      {clipboard.copied ? (
                        <CopyCheckIcon />
                      ) : (
                        <CopyIcon
                          onClick={() => clipboard.copy(providerEmail)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            -{" "}
            <div className="">
              {!mapError ? (
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.5804166329717!2d3.4116896000000003!3d6.4478794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b5fc7f5bc75%3A0xb2cb3f94ff02c02f!2sAyotech%20plumbing%20works!5e0!3m2!1sen!2sng!4v1722315870808!5m2!1sen!2sng"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="eager"
                  onError={handleMapError}
                  title={`Map of ${locationName || "service location"}`}
                  // referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              ) : (
                <div className="bg-gray-100 p-4 text-center">
                  <p>Unable to load map. Please check the link below:</p>
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Open Map
                  </a>
                </div>
              )}

              <div className=" rounded-br-2xl rounded-bl-2xl text-1xl text-white  flex items-center p-4 bg-white/15">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {locationName}
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full items-center ">
            <Separator className="w-44" />
            <span className="text-white text-1xl font-extrabold">OR</span>
            <Separator className="w-44" />
          </div>
          <div className="mt flex flex-col gap-2">
            {/* <Button className="bg-blue-400 rounded-full p-6 hover:bg-blue-300 text-black border-none outline-none">
              <Link href="/chat/booking">Book by Loca</Link>
            </Button> */}
            <BookingForm />
            <Link
              href="/faqs"
              className="text-xs underline text-center cursor-pointer"
            >
              ReadMore on How we use Loca to Book you a service provider
            </Link>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-blue-400 rounded-full p-6 hover:bg-blue-300 text-black border-none outline-none">
          Book Now
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4 bg-[#1e1f20] text-white border-none">
        <DrawerHeader className="text-left">
          <DrawerTitle>Contact {providerName}</DrawerTitle>
          <DrawerDescription>
            We provide a few options for you to book
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col ">
          <div className="">
            <div className=" grid grid-cols-2 ">
              <div>
                <Label htmlFor="link" className="text-center">
                  phone number
                </Label>
                <div className="relative">
                  <Input
                    id="link"
                    defaultValue={providerPhone || "no phone number"}
                    readOnly
                    // disabled
                    className="relative hover:border-none bg-white/15 border-none outline-none rounded-tl-2xl "
                  />
                  <div className="absolute bottom-2 text-md  right-4">
                    {clipboard.copied ? (
                      <CopyCheckIcon />
                    ) : (
                      <CopyIcon onClick={() => clipboard.copy(providerPhone)} />
                    )}
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="link" className="text-center">
                  website
                </Label>
                <div className="relative">
                  <Input
                    id="link"
                    defaultValue={providerEmail || "No website provided"}
                    readOnly
                    disabled
                    className="relative outline-none bg-white/15 border-none  rounded-tr-2xl"
                  />
                  <div className="absolute bottom-2 right-4">
                    {clipboard.copied ? (
                      <CopyCheckIcon />
                    ) : (
                      <CopyIcon onClick={() => clipboard.copy(providerEmail)} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          -{" "}
          <div className="">
            {!mapError ? (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.5804166329717!2d3.4116896000000003!3d6.4478794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b5fc7f5bc75%3A0xb2cb3f94ff02c02f!2sAyotech%20plumbing%20works!5e0!3m2!1sen!2sng!4v1722315870808!5m2!1sen!2sng"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="eager"
                onError={handleMapError}
                title={`Map of ${locationName || "service location"}`}
                // referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <div className="bg-gray-100 p-4 text-center">
                <p>Unable to load map. Please check the link below:</p>
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Open Map
                </a>
              </div>
            )}

            <div className=" rounded-br-2xl rounded-bl-2xl text-1xl text-white  flex items-center p-4 bg-white/15">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {locationName}
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full items-center ">
          <Separator className="w-44" />
          <span className="text-white text-1xl font-extrabold">OR</span>
          <Separator className="w-44" />
        </div>
        <div className="mt flex flex-col gap-2">
          {/* <Button className="bg-blue-400 rounded-full p-6 hover:bg-blue-300 text-black border-none outline-none">
            <Link href="/chat/booking">Book by Loca</Link>
          </Button> */}
          <BookingForm />
          <Link
            href="/faqs"
            className="text-xs underline text-center cursor-pointer"
          >
            ReadMore on How we use Loca to Book you a service provider
          </Link>
          {/* <span className="text-xs text-center">
              Booking by loca is still in development and will be available
              soon..
            </span> */}
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            {/* <Button variant="outline" className="bg-black border-none w-24">Cancel</Button> */}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
