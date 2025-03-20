import { useState } from "react";
import MintPage from "./mintPage";
import Trending from "./Trending";
import Explore from "./Explore";

const Home = () => {
  const [mintPage, setMintPage] = useState("create"); // Default page

  // Function to render the correct component based on `mintPage`
  const renderMintPage = () => {
    switch (mintPage) {
      case "trending":
        return <Trending />;
      case "explore":
        return <Explore />;
      case "create":
        return <MintPage />;
      default:
        return <Trending />; // Fallback case
    }
  };

  return (
    <div className="h-full w-full">
      <TopBar setMintPage={setMintPage} />
      <div className="flex justify-between m-8">
        {renderMintPage()} {/* Render dynamic content */}
      </div>
    </div>
  );
};

// ✅ Pass `setMintPage` as a prop so it updates the state in `Home`
const TopBar = ({ setMintPage }) => {
  const [activeTab, setActiveTab] = useState("trending"); // Default active tab

  return (
    <div className="bg-black text-white flex items-center pt-2 border-b border-gray-800">
      <div className="flex">
        {["trending", "explore", "create"].map((item) => (
          <button
            key={item}
            className={`relative px-4 py-2 text-lg font-medium transition-all duration-300 ease-in-out
                ${activeTab === item ? "text-blue-500" : "hover:text-blue-500"}
              `}
            onClick={() => {
              setMintPage(item);
              setActiveTab(item);
            }}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}{" "}
            {/* Capitalize first letter */}
            <span
              className={`absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 transition-all duration-300
                  ${
                    activeTab === item
                      ? "scale-x-100"
                      : "scale-x-0 hover:scale-x-100"
                  }
                `}
            ></span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
