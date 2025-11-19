import React from 'react';

export const Toast = ({ message, type }: { message: string; type: 'success' | 'error' }) => (
  <div
    className={`fixed bottom-4 right-4 p-4 rounded shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}
  >
    {message}
  </div>
);
