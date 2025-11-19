export const loggerMiddleware = () => {
  // logger middleware logic
  return (req: unknown, res: unknown, next: () => void) => {
    next();
  };
};
