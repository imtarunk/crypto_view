import { SideBarButton, FunctionButton } from "./ui/sidebarButton";
import { MdHomeFilled, MdDashboard, MdSettings } from "react-icons/md";
import { IoSwapHorizontalSharp } from "react-icons/io5";
import { FaArrowUp } from "react-icons/fa6";
import { FaArrowDown } from "react-icons/fa";

import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-[15%] border-r border-gray-800 bg-black flex flex-col">
      <div className="text-white text-3xl py-8 px-4 flex justify-center items-center border-b border-gray-800">
        <h1>CryptoView</h1>
      </div>
      <div className="flex-grow flex flex-col justify-start border-b border-gray-800">
        <button onClick={() => navigate("/")}>
          <SideBarButton text="Home" icon={<MdHomeFilled />} />
        </button>
        <button>
          <SideBarButton text="Dashboard" icon={<MdDashboard />} />
        </button>
        <button>
          <SideBarButton text="Settings" icon={<MdSettings />} />
        </button>
        {/* Add more SideBarButton components as needed */}
        <div className="border-t border-gray-800">
          <FunctionButton text="Buy" icon={<FaPlus />} />
          <FunctionButton text="Swap" icon={<IoSwapHorizontalSharp />} />
          <FunctionButton text="Send" icon={<FaArrowUp />} />
          <FunctionButton text="Receive" icon={<FaArrowDown />} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
