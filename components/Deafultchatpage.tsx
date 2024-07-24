import { CardCarousel } from "./CardCarousel";

export const DefaultChatPage = ({ user }: { user: string }) => {
    return (
      <main>
        <div className="text-[#c4c7c556] lg:text-6xl text-4xl font-semibold flex flex-col self-auto">
          <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-[#4b90ff] from-1% via-blue-600 via-5% to-15% to-[#ff5546]">
            Hello {user}
          </h1>
          <p>What can I find for you today?</p>
        </div>
        <div className="mt-20">
          <CardCarousel />
        </div>
      </main>
    );
  };