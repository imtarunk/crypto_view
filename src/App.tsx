import Sidebar from "./components/sidebar";
import Topbar from "./components/topBar";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import WalletManager from "./components/pages/ManageWallet";
import { Routes, Route } from "react-router";

function App() {
  return (
    <ConnectionProvider
      endpoint={
        "https://solana-devnet.g.alchemy.com/v2/IAF1DSxpwE1ZKom4NwQizksxb00mRb5M"
      }
    >
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="flex">
            <Sidebar />
            <div className="w-full">
              <Topbar />
              <div className="flex">
                <Routes>
                  <Route path="/manageWallet" element={<WalletManager />} />
                </Routes>
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
