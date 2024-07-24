import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { Booking } from "./booking";

export const LocalServiceCard: React.FC<LocalServiceCardProps> = ({
    name,
    address,
    rating,
    user_ratings_total,
    place_id,
  }) => {
    return (
      <div className="  border-[2px] border-[#caccce] border-dotted p-4 space-y-2 mb-4 w-full lg:max-w-[410px] text-left">
        <h3 className="text-white space-x-2 "><span className="text-primary-foreground font-semibold">Name:</span> {name}</h3>
        <p className="text-white  space-x-2"><span className="text-primary-foreground font-semibold">Address:</span>  {address}</p>
        <p className="text-white  space-x-2">
        <span className="text-primary-foreground font-semibold">Rating:</span>  {rating} ({user_ratings_total} reviews)
        </p>
        {/* <Button className="bg-blue-400 rounded-full p-6 hover:bg-blue-300 text-black" >
          <Link
            href={`https://www.google.com/maps/place/?q=place_id:${place_id}`}
            className="text-black"
          >
            Book Now
          </Link>
          Book Now
        </Button> */}
        <Booking mapLink={`https://www.google.com/maps/place/?q=place_id:${place_id}`} locationName={address} providerName={name}/>
      </div>
    );
  };