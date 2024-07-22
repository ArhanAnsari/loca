
  
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

  interface ViewMoreProps {
    data: ServiceItem[];
  }

//   export {ConversationItem, LocalServiceCardProps, ServiceItem,Location}