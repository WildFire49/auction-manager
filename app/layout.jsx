import React from 'react';
import './globals.css';
import ClientProviders from './ClientProviders.jsx';

export const metadata = {
  title: 'Auction Manager',
  description: 'Beautiful live auction dashboard in INR',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
