/**
 * Breadcrumb component
 * @module components/ui
 */

'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
}

export function Breadcrumb({ items, separator = '/', className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="text-blue-600 dark:text-blue-400 hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
          )}

          {index < items.length - 1 && (
            <span className="text-gray-400 dark:text-gray-600">{separator}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
