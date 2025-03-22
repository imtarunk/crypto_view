import { useState } from "react";
import TokenLaunchModel from "../tokenLaunchModel";
import {
  useConnection,
  useWallet,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import {
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
  Connection,
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

const mintTokens = async (
  wallet: WalletContextState,
  connection: Connection,
  decimals: number,
  mintPublicKey: PublicKey,
  amount: string | number
): Promise<string | null> => {
  try {
    if (!wallet.publicKey) {
      toast.error("Connect your wallet first!");
      return null;
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

    // Mint tokens (considering the decimals of your token)
    const mintAmount = Number(amount) * Math.pow(10, decimals);

    transaction.add(
      createMintToInstruction(
        mintPublicKey,
        associatedTokenAddress,
        wallet.publicKey,
        BigInt(mintAmount)
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

    toast.success(`Minted ${amount} tokens! TXID: ${signature}`);
    console.log(
      `Minted ${amount} tokens: https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
    return signature;
  } catch (error) {
    console.error("Error minting tokens:", error);
    toast.error("Minting failed!");
    return null;
  }
};

const SolanaTokenCreatorForm = () => {
  const [decimals, setDecimals] = useState("6");
  const wallet = useWallet();
  const { connection } = useConnection();
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [amount, setAmount] = useState("100");
  const [isLoading, setIsLoading] = useState(false);

  const createToken = async () => {
    try {
      setIsLoading(true);
      if (!wallet.publicKey) {
        toast.error("Connect your wallet first!");
        setIsLoading(false);
        return;
      }

      if (!tokenName || !tokenSymbol || !decimals || !amount) {
        toast.error("Please fill in all fields");
        setIsLoading(false);
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
        mintKeypair.publicKey,
        amount
      );
      if (mintSignature) {
        toast.success("Tokens minted successfully!");
      }
    } catch (error) {
      console.error("Error creating token:", error);
      toast.error("Token creation failed!");
    } finally {
      setIsLoading(false);
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

        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block mb-2 font-medium text-gray-300">
                Token Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: Solana"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Choose a memorable name for your token
              </p>
            </div>

            <div className="relative">
              <label className="block mb-2 font-medium text-gray-300">
                Token Symbol
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: SOL"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Usually 3-4 characters (e.g., BTC, ETH)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block mb-2 font-medium text-gray-300">
                Decimals
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="9"
                  value={decimals}
                  onChange={(e) => setDecimals(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Standard is 6 or 9 (like SOL or USDC)
              </p>
            </div>
            <div className="relative">
              <label className="block mb-2 font-medium text-gray-300">
                Initial Supply
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                How many tokens to mint initially
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={createToken}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02] flex justify-center items-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Token...
              </>
            ) : (
              <>Create Token</>
            )}
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="font-medium text-gray-300 mb-2">
            Token Details Summary
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-400">Name:</div>
            <div className="text-white">{tokenName || "Not set"}</div>
            <div className="text-gray-400">Symbol:</div>
            <div className="text-white">{tokenSymbol || "Not set"}</div>
            <div className="text-gray-400">Decimals:</div>
            <div className="text-white">{decimals}</div>
            <div className="text-gray-400">Initial Supply:</div>
            <div className="text-white">{amount || "Not set"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
