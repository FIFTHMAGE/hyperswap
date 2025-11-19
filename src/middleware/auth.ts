export const authMiddleware = () => {
  // auth middleware logic
  return (req: unknown, res: unknown, next: () => void) => {
    next();
  };
};
