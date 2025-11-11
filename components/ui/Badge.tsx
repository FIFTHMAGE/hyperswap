interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

export function Badge({ children, variant = 'primary' }: BadgeProps) {
  const variantClasses = {
    primary: 'bg-purple-500/20 text-purple-300',
    secondary: 'bg-gray-500/20 text-gray-300',
    success: 'bg-green-500/20 text-green-300',
    warning: 'bg-yellow-500/20 text-yellow-300',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

