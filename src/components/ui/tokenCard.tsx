import { useState } from "react";
import TokenLaunchModel from "../tokenLaunchModel";
import { Upload, ChevronUp, ChevronDown } from "lucide-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMint2Instruction,
  createMintToInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import toast from "react-hot-toast";

export const MintCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-900 p-10 py-15 rounded-3xl shadow-lg w-1/2 m-4">
      <div className="flex items-center mb-4">
        <div className="bg-yellow-500 p-2 rounded-full">
          <span className="text-white text-xl">📷</span>
        </div>
        <span className="ml-2 text-white text-xl">Create a mint</span>
      </div>
      <p className="text-gray-400 mb-4">
        Put your creativity onchain, share with the world, and start earning
      </p>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-2 px-4 rounded-full hover:bg-opacity-90 transition duration-200"
      >
        Create mint
      </button>
      <TokenLaunchModel isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}>
        <SolanaTokenCreatorForm />
      </TokenLaunchModel>
    </div>
  );
};

const mintTokens = async (wallet, connection, decimals, mintPublicKey) => {
  try {
    if (!wallet.publicKey) {
      toast.error("Connect your wallet first!");
      return;
    }

    const recipientPublicKey = wallet.publicKey; // Minting to the connected wallet

    // Get or create the associated token account
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      recipientPublicKey
    );

    // Check if the associated token account exists (if not, create it)
    const accountInfo = await connection.getAccountInfo(associatedTokenAddress);
    const transaction = new Transaction();

    if (!accountInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedTokenAddress,
          recipientPublicKey,
          mintPublicKey
        )
      );
    }

    // Mint 100 tokens (considering the decimals of your token)
    const mintAmount = 100 * Math.pow(10, decimals);

    transaction.add(
      createMintToInstruction(
        mintPublicKey,
        associatedTokenAddress,
        wallet.publicKey,
        mintAmount
      )
    );

    // Sign and send the transaction
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const signedTransaction = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );

    toast.success(`Minted 100 tokens! TXID: ${signature}`);
    console.log(
      `Minted 100 tokens: https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
    return signature;
  } catch (error) {
    console.error("Error minting tokens:", error);
    toast.error("Minting failed!");
    return null;
  }
};

const SolanaTokenCreatorForm = () => {
  const [description, setDescription] = useState("");
  const [socialLinks, setSocialLinks] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [decimals, setDecimals] = useState("6");
  const wallet = useWallet();
  const { connection } = useConnection();
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");

  const createToken = async () => {
    try {
      if (!wallet.publicKey) {
        toast.error("Connect your wallet first!");
        return;
      }
      const lamports = await getMinimumBalanceForRentExemptMint(connection);

      const mintKeypair = Keypair.generate();
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMint2Instruction(
          mintKeypair.publicKey,
          parseInt(decimals),
          wallet.publicKey,
          wallet.publicKey,
          TOKEN_PROGRAM_ID
        )
      );

      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      transaction.partialSign(mintKeypair);

      const signedTransaction = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      toast.success(`Token created successfully! TXID: ${signature}`);
      console.log(
        `Token created: https://explorer.solana.com/tx/${signature}?cluster=devnet`
      );

      const mintSignature = await mintTokens(
        wallet,
        connection,
        parseInt(decimals),
        mintKeypair.publicKey
      );
      if (mintSignature) {
        toast.success("Tokens minted successfully!");
      }
    } catch (error) {
      console.error("Error creating token:", error);
      toast.error("Token creation failed!");
    }
  };

  return (
    <div className="rounded-xl bg-gray-900 text-gray-200 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent mb-2">
            Solana Token Creator
          </h1>
          <p className="text-gray-400">
            Easily Create your own Solana SPL Token in just a few steps without
            Coding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              placeholder="Ex: Solana"
              className="w-full bg-gray-800 border border-gray-700 rounded p-3"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2">Symbol</label>
            <input
              type="text"
              placeholder="Ex: SOL"
              className="w-full bg-gray-800 border border-gray-700 rounded p-3"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2">Decimals</label>
            <input
              type="number"
              value={decimals}
              onChange={(e) => setDecimals(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded p-3"
            />
          </div>
        </div>

        <button
          onClick={createToken}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Create Token
        </button>
      </div>
    </div>
  );
};
