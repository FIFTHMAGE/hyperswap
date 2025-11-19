export const rateLimitMiddleware = () => {
  // rateLimit middleware logic
  return (req: unknown, res: unknown, next: () => void) => {
    next();
  };
};
