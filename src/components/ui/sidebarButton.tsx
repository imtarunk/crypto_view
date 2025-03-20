interface Props {
  children?: React.ReactNode;
  icon?: React.ReactNode; // Assuming you want to pass an icon as a prop
  text: string;
}

export const SideBarButton = ({ icon, text }: Props) => {
  return (
    <button className="flex gap-2 m-3 py-3 p-4 space-x-1 text-amber-50 hover:bg-blue-600  rounded-full cursor-pointer">
      {" "}
      {icon && <span className="text-2xl">{icon}</span>}
      <span>{text}</span>
    </button>
  );
};

export const FunctionButton = ({ icon, text }: Props) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 m-1 rounded-xl cursor-pointer hover:bg-gray-800 transition-colors duration-200">
      {icon && (
        <div className="bg-gray-700 p-2 rounded-full hover:bg-gray-500 transition-colors duration-200">
          <span className="text-xl text-white"> {icon}</span>
        </div>
      )}
      <span className="text-sm text-amber-50">{text}</span>
    </div>
  );
};
