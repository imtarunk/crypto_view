export const MintCard = () => {
  return (
    <div className="bg-gray-900 p-10 py-15 rounded-3xl shadow-lg w-1/2 m-4 ">
      <div className="flex items-center mb-4">
        <div className="bg-yellow-500 p-2 rounded-full">
          <span className="text-white text-xl">📷</span>
        </div>
        <span className="ml-2 text-white text-xl">Create a mint</span>
      </div>
      <p className="text-gray-400 mb-4">
        Put your creativity onchain, share with the world, and start earning
      </p>
      <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-2 px-4 rounded-full hover:bg-opacity-90 transition duration-200">
        Create mint
      </button>
    </div>
  );
};
