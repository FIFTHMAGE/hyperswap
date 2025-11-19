export const corsMiddleware = () => {
  // cors middleware logic
  return (req: unknown, res: unknown, next: () => void) => {
    next();
  };
};
