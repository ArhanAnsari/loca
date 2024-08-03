// interface ServiceItem {
//   name: string;
//   address: string;
//   rating: number;
//   user_ratings_total: number;
//   place_id: string;
// }

interface LocalServiceCardProps {
  name: string;
  address: string;
  rating: number;
  user_ratings_total: number;
  place_id: string;
  phone_number?: string;
  website?: string;
  email?: string;
}

interface ViewMoreProps {
  data: ServiceItem[];
}

type ChatPageProps = {
  message: ConversationItem;
  index: number;
  image: StaticImageData | string;
  logo: StaticImageData;
  isLoading: boolean;

  conversationEndRef: React.RefObject<HTMLDivElement>;
};

interface ChatInboxProps {
  locationError: string | null;
  isProcessing: boolean;
  handleInput: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
  userMessage: string;
  handleSendMessage: () => Promise<void>;
}

interface Location {
  latitude: number | null;
  longitude: number | null;
}

interface ServiceItem {
  place_id: string;
  name: string;
  address: string;
  rating: number;
  user_ratings_total: number;
  phone_number?: string;
  website?: string;
  email?: string;
}

interface CustomInputProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}