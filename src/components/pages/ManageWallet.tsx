import { useState } from "react";
import { MoreVertical, Plus } from "lucide-react";

const wallets = [
  { id: 1, address: "bc1qfj...m8kh", icon: "🧑", type: "Coinbase Wallet" },
  { id: 2, address: "DTAPND...VY8W", icon: "🤖", type: "Coinbase Wallet" },
  { id: 3, address: "0x95aa...D81d", icon: "🎵", type: "Coinbase Wallet" },
  { id: 4, address: "ltc1qt...a97t", icon: "😺", type: "Coinbase Wallet" },
  { id: 5, address: "7JgHQE...bzQW", icon: "🐱", type: "Coinbase Wallet" },
];

export default function WalletManager() {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-[60%] h-screen mx-auto p-6 bg-black text-white absolute right-1 border-l border-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage wallets</h2>
        <button className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full">
          <Plus className="mr-2" size={18} /> Add wallet
        </button>
      </div>

      <h3 className="text-lg font-medium mb-2">Connected addresses</h3>

      {/* Wallet List */}
      <div className="p-4 space-y-3">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="flex items-center justify-between p-3 hover:bg-gray-900 transition cursor-pointer rounded-3xl"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{wallet.icon}</span>
              <div>
                <p className="text-white text-sm font-medium">
                  {wallet.address}
                </p>
                <p className="text-gray-400 text-xs">{wallet.type}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selected.includes(wallet.id)}
                onChange={() => toggleSelect(wallet.id)}
                className="form-checkbox h-5 w-5 text-blue-500 rounded"
              />
              <MoreVertical
                className="text-gray-400 cursor-pointer"
                size={18}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
