"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import axios from "axios";
import { LocalServiceCard } from "./LocalServiceCard";

const ViewMore: React.FC<ViewMoreProps> = ({ data }) => {
  return (
    <main>
      <Sheet>
        <SheetTrigger className="underline text-blue-600">
          View More
        </SheetTrigger>
        <SheetContent className="bg-[#1e1f20] text-white border-none section overflow-auto">
          <SheetHeader className="mt-5">
            <SheetTitle className="text-white text-md">
              These are the Rest of Services find near you.
            </SheetTitle>
            <SheetDescription></SheetDescription>

            {data.map((service: ServiceItem) => (
              <LocalServiceCard
                key={service.place_id}
                name={service.name}
                address={service.address}
                rating={service.rating}
                user_ratings_total={service.user_ratings_total}
                place_id={service.place_id}
              />
            ))}
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </main>
  );
};

export default ViewMore;
