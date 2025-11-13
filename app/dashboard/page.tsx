'use client';

import { Card } from '@/components/ui/Card';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Users', value: '12,345', change: '+12%' },
    { label: 'Active Wallets', value: '8,432', change: '+8%' },
    { label: 'Total Transactions', value: '1.2M', change: '+24%' },
    { label: 'Chains Supported', value: '5', change: '0%' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {stat.value}
            </p>
            <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-gray-600'}`}>
              {stat.change} from last month
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">New user signup</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">2 minutes ago</p>
              </div>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-sm">
                User
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Wrapped generated</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">5 minutes ago</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-sm">
                Analytics
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Chains
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">Ethereum</span>
              <span className="text-gray-600 dark:text-gray-400">45%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }} />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">Polygon</span>
              <span className="text-gray-600 dark:text-gray-400">28%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '28%' }} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

