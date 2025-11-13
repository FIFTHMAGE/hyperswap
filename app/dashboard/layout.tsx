export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <aside className="w-64 bg-white dark:bg-gray-800 min-h-screen border-r border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Dashboard
            </h2>
            <nav className="space-y-2">
              <a href="/dashboard" className="block px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                Overview
              </a>
              <a href="/dashboard/analytics" className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Analytics
              </a>
              <a href="/dashboard/users" className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Users
              </a>
              <a href="/dashboard/chains" className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Chains
              </a>
            </nav>
          </div>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

