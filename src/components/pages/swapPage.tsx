import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CryptoChart from "../CryptoChart";

const SolIcon = () => (
  <div className="relative w-6 h-6 flex items-center justify-center">
    <motion.div
      animate={{
        rotate: [0, 10, 0, -10, 0],
      }}
      transition={{ repeat: Infinity, duration: 5 }}
      className="text-purple-500"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 14.25L16.5 3.75H18L7.5 14.25H6Z" fill="currentColor" />
        <path d="M6 9.75L16.5 20.25H18L7.5 9.75H6Z" fill="currentColor" />
        <path d="M16.5 9.75L6 20.25H7.5L18 9.75H16.5Z" fill="currentColor" />
      </svg>
    </motion.div>
    <motion.div
      className="absolute inset-0 rounded-full border-2 border-purple-500 opacity-30"
      animate={{ scale: [0.8, 1.2, 0.8] }}
      transition={{ repeat: Infinity, duration: 3 }}
    />
  </div>
);

const BitcoinIcon = () => (
  <div className="relative w-6 h-6 flex items-center justify-center">
    <motion.div
      animate={{
        rotate: [0, 10, 0, -10, 0],
      }}
      transition={{ repeat: Infinity, duration: 5 }}
      className="text-orange-500"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5 3.5V5H10V6.5H11.5V17.5H10V19H11.5V20.5H13V19H14.5V17.5H13V6.5H14.5V5H13V3.5H11.5ZM13 6.5H14.5C15.328 6.5 16 7.172 16 8V10C16 10.828 15.328 11.5 14.5 11.5H13V6.5ZM13 12.5H14.5C15.328 12.5 16 13.172 16 14V16C16 16.828 15.328 17.5 14.5 17.5H13V12.5Z"
          fill="currentColor"
        />
      </svg>
    </motion.div>
    <motion.div
      className="absolute inset-0 rounded-full border-2 border-orange-500 opacity-30"
      animate={{ scale: [0.8, 1.2, 0.8] }}
      transition={{ repeat: Infinity, duration: 3 }}
    />
  </div>
);

const USDCIcon = () => (
  <div className="relative w-6 h-6 flex items-center justify-center">
    <motion.div
      animate={{
        rotate: [0, 10, 0, -10, 0],
      }}
      transition={{ repeat: Infinity, duration: 5 }}
      className="text-blue-500"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <path
          d="M12 6C9.791 6 8 7.791 8 10H10C10 8.895 10.895 8 12 8C13.105 8 14 8.895 14 10C14 10.738 13.598 11.376 13 11.723V15H11V13H10V16H14V12.277C14.598 11.93 15 11.293 15 10.554C15 8.59 13.657 7 12 7V6ZM10 17V19H14V17H10Z"
          fill="white"
        />
      </svg>
    </motion.div>
    <motion.div
      className="absolute inset-0 rounded-full border-2 border-blue-500 opacity-30"
      animate={{ scale: [0.8, 1.2, 0.8] }}
      transition={{ repeat: Infinity, duration: 3 }}
    />
  </div>
);

// Token List
const tokens = [
  {
    name: "SOL",
    icon: <SolIcon />,
    address: "So11111111111111111111111111111111111111112",
  },
  {
    name: "BTC",
    icon: <BitcoinIcon />,
    address: "Bitcoin11111111111111111111111111111111111111",
  },
  {
    name: "USDC",
    icon: <USDCIcon />,
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
];

const CryptoSwap = () => {
  const [fromToken, setFromToken] = useState(tokens[0].name);
  const [toToken, setToToken] = useState(tokens[2].name);
  const [amount, setAmount] = useState(0);
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    const fromAddress = tokens.find((t) => t.name === fromToken)?.address;
    const toAddress = tokens.find((t) => t.name === toToken)?.address;

    if (!fromAddress || !toAddress || amount <= 0) return;

    const getQuote = async () => {
      setIsLoading(true);
      // Simulate API call with timeout
      setTimeout(() => {
        const simulatedQuote = {
          outAmount: amount * (Math.random() * 10 + 90),
        };
        setQuote(simulatedQuote);
        setIsLoading(false);
      }, 700);
    };

    getQuote();

    const interval = setInterval(() => {
      getQuote();
    }, 10000);

    return () => clearInterval(interval);
  }, [fromToken, toToken, amount]);

  const handleSwapTokens = () => {
    setShowParticles(true);
    setTimeout(() => {
      setFromToken(toToken);
      setToToken(fromToken);
      setShowParticles(false);
    }, 500);
  };

  return (
    <div className="p-8 flex items-center text-white border-2 w-full h-full">
      {/* Background elements */}
      <div>
        <div className="inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        {/* Matrix-like particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-500 rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20,
            }}
            animate={{
              y: window.innerHeight + 20,
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 15,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}

        {/* Hexagonal grid pattern */}
        <div className=" inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern
              id="hexagons"
              width="50"
              height="43.4"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(3)"
            >
              <path
                d="M25,0 L50,14.4 L50,43.4 L25,57.8 L0,43.4 L0,14.4 Z"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>

        {/* Glowing orbs */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              background:
                i === 0
                  ? "radial-gradient(circle, rgba(79,70,229,0.15) 0%, rgba(0,0,0,0) 70%)"
                  : i === 1
                  ? "radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(0,0,0,0) 70%)"
                  : "radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(0,0,0,0) 70%)",
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
            }}
            initial={{
              x: `${25 + i * 20}%`,
              y: `${30 + i * 25}%`,
            }}
            animate={{
              x: [`${25 + i * 20}%`, `${35 + i * 15}%`, `${25 + i * 20}%`],
              y: [`${30 + i * 25}%`, `${40 + i * 20}%`, `${30 + i * 25}%`],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative bg-black/50 backdrop-blur-md p-6 rounded-xl shadow-xl max-w-md w-full mt-6 border border-gray-800 z-10"
        >
          <CryptoChart />
        </motion.div>
      </div>
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-black/50 backdrop-blur-xs p-8 rounded-xl shadow-xl max-w-md w-full border border-gray-800 z-10"
        >
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent"></div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              <motion.h2
                className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Crypto Swap
              </motion.h2>
              <div className="flex space-x-2">
                {tokens.map((token) => (
                  <motion.div key={token.name} whileHover={{ scale: 1.1 }}>
                    {token.icon}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* From Section */}
              <motion.div
                className="bg-gray-900/80 p-5 rounded-lg border border-gray-800"
                whileHover={{ boxShadow: "0 0 15px rgba(6, 182, 212, 0.2)" }}
              >
                <p className="text-gray-400 mb-2 text-sm">From</p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-3 w-full">
                    <motion.div whileHover={{ scale: 1.1 }}>
                      {tokens.find((t) => t.name === fromToken)?.icon}
                    </motion.div>
                    <select
                      className="bg-black text-white p-2 rounded-lg cursor-pointer border border-gray-800"
                      onChange={(e) => setFromToken(e.target.value)}
                      value={fromToken}
                    >
                      {tokens.map((token) => (
                        <option key={token.name} value={token.name}>
                          {token.name}
                        </option>
                      ))}
                    </select>
                    <motion.input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="text-white p-2 rounded-lg bg-black border border-gray-800 w-full focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      whileFocus={{
                        boxShadow: "0 0 10px rgba(6, 182, 212, 0.3)",
                      }}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Swap Icon */}
              <div className="flex justify-center relative">
                <AnimatePresence>
                  {showParticles && (
                    <>
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                          initial={{
                            opacity: 1,
                            x: 0,
                            y: 0,
                          }}
                          animate={{
                            opacity: 0,
                            x: (Math.random() - 0.5) * 100,
                            y: (Math.random() - 0.5) * 100,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>

                <motion.button
                  className="bg-black p-3 rounded-full border border-gray-800 shadow-lg z-10"
                  whileHover={{
                    scale: 1.1,
                    rotate: 180,
                    boxShadow: "0 0 15px rgba(6, 182, 212, 0.3)",
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSwapTokens}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 10L12 15L17 10H7Z" fill="#06B6D4" />
                    <path d="M17 14L12 9L7 14H17Z" fill="#A855F7" />
                  </svg>
                </motion.button>
              </div>

              {/* To Section */}
              <motion.div
                className="bg-gray-900/80 p-5 rounded-lg border border-gray-800"
                whileHover={{ boxShadow: "0 0 15px rgba(168, 85, 247, 0.2)" }}
              >
                <p className="text-gray-400 mb-2 text-sm">To</p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.1 }}>
                      {tokens.find((t) => t.name === toToken)?.icon}
                    </motion.div>
                    <select
                      className="bg-black text-white p-2 rounded-lg cursor-pointer border border-gray-800"
                      onChange={(e) => setToToken(e.target.value)}
                      value={toToken}
                    >
                      {tokens.map((token) => (
                        <option key={token.name} value={token.name}>
                          {token.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <motion.div
                    animate={
                      isLoading ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }
                    }
                    transition={{
                      repeat: isLoading ? Infinity : 0,
                      duration: 1,
                    }}
                    className="text-right"
                  >
                    <p className="text-gray-400 text-sm">You receive</p>
                    <p className="text-lg font-medium">
                      {isLoading ? (
                        <span className="text-cyan-400">Loading...</span>
                      ) : quote ? (
                        <span>{quote.outAmount.toFixed(2)}</span>
                      ) : (
                        <span>0.00</span>
                      )}
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Price */}
              <div className="flex justify-between text-md text-gray-500 px-2 ">
                <span>Exchange Rate:</span>
                <span>
                  {quote
                    ? `1 ${fromToken} ≈ ${(quote.outAmount / amount).toFixed(
                        4
                      )} ${toToken}`
                    : "--"}
                </span>
              </div>

              {/* Swap Button */}
              <motion.button
                className="w-full bg-black text-white font-bold py-4 rounded-lg mt-4 relative overflow-hidden border border-gray-800"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "linear",
                  }}
                  style={{ opacity: 0.2 }}
                />
                <span className="relative z-10 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-bold">
                  Swap Tokens
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>{" "}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 bg-black/50 backdrop-blur-md p-4 rounded-xl border border-gray-800 max-w-md w-full z-10"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-400 text-sm">Network Status:</span>
              <span className="text-green-500 text-sm">Active</span>
            </div>
            <div className="text-gray-400 text-sm">
              Gas: <span className="text-cyan-400">32 Gwei</span>
            </div>
            <div className="text-gray-400 text-sm">
              Block: <span className="text-purple-400">#14582931</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CryptoSwap;
