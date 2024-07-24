

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
  manualLocation: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  userMessage: string;
  handleInput: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isProcessing: boolean;
  handleSendMessage: () => Promise<void>;
  setManualLocation: React.Dispatch<React.SetStateAction<string>>;
}
