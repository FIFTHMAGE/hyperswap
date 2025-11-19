export const EmptyState = ({ message, icon }: { message: string; icon?: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
    {icon}
    <p className="mt-4">{message}</p>
  </div>
);
