import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { MdSettings } from "react-icons/md";
import { useNavigate } from "react-router";

const Topbar = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-black w-full h-18 border-b border-gray-800 flex justify-end items-center">
      <div className="flex justify-end items-center h-full mx-4 space-x-5">
        <div className="bg-gray-700 p-2 rounded-full hover:bg-gray-500 ">
          {
            <MdSettings
              className="text-xl text-white "
              onClick={() => navigate("/manageWallet")}
            />
          }
        </div>
        <WalletMultiButton />
      </div>
    </div>
  );
};

export default Topbar;
