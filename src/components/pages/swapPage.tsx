import "chart.js/auto";
import CryptoChart from "../CryptoChart";
import { useState, useEffect, JSX } from "react";
import { Solicon, BitcoinIcon } from "../ui/cryptIcon";
// import { Connection } from "@solana/web3.js";
import axios from "axios";

// Define token type
interface Token {
  name: string;
  icon: JSX.Element;
  address: string;
}

// RPC Connection
// const connection = new Connection(
//   "https://neat-hidden-sanctuary.solana-mainnet.discover.quiknode.pro/2af5315d336f9ae920028bbb90a73b724dc1bbed/"
// );

// Token List
const tokens: Token[] = [
  {
    name: "SOL",
    icon: <Solicon />,
    address: "So11111111111111111111111111111111111111112",
  },
  {
    name: "BTC",
    icon: <BitcoinIcon />,
    address: "Bitcoin11111111111111111111111111111111111111",
  },
  {
    name: "USDC",
    icon: (
      <img
        src="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
        alt="USDC"
        className="w-5 h-5"
      />
    ),
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
];

// API Response Type
interface QuoteResponse {
  outAmount: number;
}

const CryptoSwap: React.FC = () => {
  const [fromToken, setFromToken] = useState<string>(tokens[0].name);
  const [toToken, setToToken] = useState<string>(tokens[2].name);
  const [amount, setAmount] = useState<number>(0);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);

  useEffect(() => {
    const fromAddress = tokens.find((t) => t.name === fromToken)?.address;
    const toAddress = tokens.find((t) => t.name === toToken)?.address;

    if (!fromAddress || !toAddress || amount <= 0) return;

    const getQuote = async () => {
      try {
        const { data } = await axios.get<QuoteResponse>(
          `https://quote-api.jup.ag/v6/quote?inputMint=${fromAddress}&outputMint=${toAddress}&amount=${
            amount * 100000000
          }&slippageBps=50`
        );
        console.log(data);
        setQuote(data);
      } catch (error) {
        console.error("Error fetching quote:", error);
      }
    };

    getQuote(); // Fetch immediately

    const interval = setInterval(() => {
      getQuote();
    }, 10000);

    return () => clearInterval(interval);
  }, [fromToken, toToken, amount]);

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg max-w-md mx-auto text-white">
      <h2 className="text-xl font-bold mb-4">Crypto Swap</h2>
      <div className="space-y-4">
        {/* From Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400">From</p>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2 w-full">
              {tokens.find((t) => t.name === fromToken)?.icon}
              <select
                className="bg-gray-700 text-white p-2 rounded-lg cursor-pointer"
                onChange={(e) => setFromToken(e.target.value)}
                value={fromToken}
              >
                {tokens.map((token) => (
                  <option key={token.name} value={token.name}>
                    {token.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="text-white p-2 rounded-lg bg-gray-800 w-full focus:outline-none focus:ring-0 appearance-none"
                style={{ MozAppearance: "textfield" }}
              />
            </div>
            <p className="text-gray-400">
              {quote ? `~$${quote.outAmount}` : "~$0"}
            </p>
          </div>
        </div>

        {/* Swap Icon */}
        <div className="flex justify-center">
          <button
            className="bg-blue-500 p-2 rounded-full"
            onClick={() => {
              setFromToken(toToken);
              setToToken(fromToken);
            }}
          >
            ⬇️
          </button>
        </div>

        {/* To Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400">To</p>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              {tokens.find((t) => t.name === toToken)?.icon}
              <select
                className="bg-gray-700 text-white p-2 rounded-lg cursor-pointer"
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
            <p className="text-gray-400">
              {quote ? `~$${quote.outAmount}` : "~$0"}
            </p>
          </div>
        </div>

        {/* Swap Button */}
        <button className="w-full bg-blue-400 text-black font-bold py-3 rounded-lg mt-4 hover:bg-blue-500">
          Swap
        </button>
      </div>
      <CryptoChart />
    </div>
  );
};

export default CryptoSwap;
