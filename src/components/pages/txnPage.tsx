import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  SystemProgram,
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [type, setType] = useState("send");

  const { publicKey, signTransaction } = useWallet();
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  const handleSend = async () => {
    if (!publicKey) {
      toast.error("❌ Wallet not connected. Please connect your wallet.", {
        position: "bottom-right",
      });
      return;
    }

    if (!to || !amount || amount <= 0) {
      toast.error("❌ Enter a valid recipient address and amount.", {
        position: "bottom-right",
      });
      return;
    }

    if (!signTransaction) {
      toast.error(
        "❌ Your wallet does not support signing transactions. Try another wallet.",
        {
          position: "bottom-right",
        }
      );
      return;
    }

    try {
      setLoading(true);
      toast.loading("⏳ Processing transaction...", {
        position: "bottom-right",
      });

      const lamportsToSend = Math.floor(1000000000 * amount); // Convert SOL to lamports
      const recipientPubkey = new PublicKey(to);
      const transaction = new Transaction();
      const { blockhash } = await connection.getLatestBlockhash();

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: lamportsToSend,
        })
      );

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // ✅ Sign transaction
      const signedTransaction = await signTransaction(transaction);

      // ✅ Send transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      // ✅ Confirm transaction
      await connection.confirmTransaction(signature, "confirmed");

      toast.dismiss();
      toast.success(`Transaction successful!`, {
        position: "bottom-right",
      });
    } catch (error) {
      console.error("❌ Error sending transaction:", error);
      toast.dismiss();
      toast.error("❌ Transaction failed. Please try again.", {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white p-6 rounded-2xl shadow-2xl shadow-blue-900/20 mt-20 border border-blue-900/30 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
        Transaction
      </h1>

      <div className="flex justify-center space-x-4 mb-8 bg-gray-900 rounded-full p-1">
        <button
          className={`px-6 py-2 rounded-full transition-all duration-300 ${
            type === "send"
              ? "bg-blue-600 text-white scale-105 shadow-lg shadow-blue-600/50"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
          onClick={() => setType("send")}
        >
          Send
        </button>
        <button
          className={`px-6 py-2 rounded-full transition-all duration-300 ${
            type === "receive"
              ? "bg-blue-600 text-white scale-105 shadow-lg shadow-blue-600/50"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
          onClick={() => setType("receive")}
        >
          Receive
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl p-4 mb-4 border border-blue-900/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <input
              type="number"
              placeholder="0.00"
              className="bg-transparent text-3xl w-full outline-none text-blue-300 placeholder-blue-900"
              value={amount ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setAmount(value ? Number(value) : undefined);
              }}
            />
            <span className="text-gray-500 text-xl font-medium">SOL</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-4 mb-4 border border-blue-900/20 relative">
        <input
          type="text"
          placeholder="Recipient Wallet Address"
          className="w-full bg-transparent outline-none text-blue-300 
          placeholder:text-sm placeholder:text-blue-900"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      <button
        onClick={handleSend}
        disabled={loading}
        className={`w-full py-4 rounded-xl transition-all duration-300 font-bold uppercase tracking-wider ${
          loading
            ? "bg-gray-800 text-gray-500 cursor-wait"
            : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/50 active:scale-[0.98]"
        }`}
      >
        {loading ? "Processing..." : "Send"}
      </button>

      {amount && to && (
        <div className="mt-4 text-sm text-gray-500 space-y-2 bg-gray-900 p-3 rounded-lg border border-blue-900/20">
          <div className="flex justify-between">
            <span>Network Fee</span>
            <span className="text-blue-300">0.0001 SOL</span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount</span>
            <span className="text-blue-300">{amount} SOL</span>
          </div>
        </div>
      )}
    </div>
  );
};

const TxnPage = () => {
  return (
    <div className="flex items-center flex-col p-10 w-full">
      <h1 className="text-5xl text-white capitalize">Send crypto</h1>
      <Page />
    </div>
  );
};

export default TxnPage;
