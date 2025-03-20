import Sidebar from "./components/sidebar";
import Topbar from "./components/topBar";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { AnimatePresence, motion } from "framer-motion";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import WalletManager from "./components/pages/ManageWallet";
import { Routes, Route, useLocation } from "react-router";
import Home from "./components/pages/home";
import { pageVariants } from "./components/util";

function App() {
  const location = useLocation();

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
                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route
                      path="/manageWallet"
                      element={
                        <motion.div
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          variants={pageVariants}
                        >
                          <WalletManager />
                        </motion.div>
                      }
                    />
                  </Routes>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
