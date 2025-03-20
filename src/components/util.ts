export const pageVariants = {
  initial: { x: "50vw", opacity: 0 }, // Start fully outside from the right
  animate: {
    x: 0,
    opacity: 1,
    transition: { type: "tween", duration: 0.5, ease: "easeOut" },
  },
  exit: {
    x: 0,
    opacity: 0,
    transition: { type: "tween", duration: 0.5, ease: "easeInOut" },
  },
};
