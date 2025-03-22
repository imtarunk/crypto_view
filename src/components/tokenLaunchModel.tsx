import { motion } from "framer-motion";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const TokenLaunchModel: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="inset-0 bg-black/50 backdrop-blur-s flex items-center justify-center z-20 fixed">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative m-5"
      >
        <IoIosCloseCircleOutline
          className="text-xl absolute top-2 right-2 text-red-500"
          onClick={onClose}
        />

        {children}
      </motion.div>
    </div>
  );
};

export default TokenLaunchModel;
