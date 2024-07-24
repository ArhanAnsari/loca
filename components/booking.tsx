import * as React from "react";

import { cn } from "@/lib/utils";
// import { useMediaQuery } from "@/hooks/use-media-query"
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
export function Booking({
  mapLink,
  locationName,
  providerName,
}: {
  mapLink: string;
  locationName: string;
  providerName: string;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-blue-400 rounded-full p-6 hover:bg-blue-300 text-black border-none outline-none">
            Booking
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
                  <Input
                    id="link"
                    defaultValue="1234567890"
                    readOnly
                    disabled
                    className="hover:border-none bg-white/15 border-none outline-none rounded-tl-2xl "
                  />
                </div>
                <div>
                  <Label htmlFor="link" className="text-center">
                    website
                  </Label>
                  <Input
                    id="link"
                    defaultValue="1234567890"
                    readOnly
                    disabled
                    className="outline-none bg-white/15 border-none  rounded-tr-2xl"
                  />
                </div>
              </div>
            </div>
            <span>{mapLink}</span>
            <div className="">
              <iframe
                title={locationName}
                src={mapLink}
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="eager"
                // referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
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
            <span className="text-sm underline">
              ReadMore on How we use Loca to Book you a service provider
            </span>
            <Button className="bg-blue-400 rounded-full p-6 hover:bg-blue-300 text-black border-none outline-none">
              Book by Loca
            </Button>
            <span className="text-xs text-center">
              Booking by loca is still in development and will be available
              soon..
            </span>
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
          Book
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
                <Input
                  id="link"
                  defaultValue="1234567890"
                  readOnly
                  className="outline-none bg-white/15 border-none rounded-tl-2xl "
                />
              </div>
              <div>
                <Label htmlFor="link" className="text-center">
                  website
                </Label>
                <Input
                  id="link"
                  defaultValue="1234567890"
                  readOnly
                  className="outline-none bg-white/15 border-none  rounded-tr-2xl"
                />
              </div>
            </div>
          </div>
          <div className="">
            <iframe
              title={locationName}
              src={mapLink}
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="eager"
              // referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
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
          <span className="text-sm underline">
            ReadMore on How we use Loca to Book you a service provider
          </span>
          <Button className="bg-blue-400 rounded-full p-6 hover:bg-blue-300 text-black border-none outline-none">
            Book by Loca
          </Button>
          <span className="text-xs text-center">
            Booking by loca is still in development and will be available soon..
          </span>
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
