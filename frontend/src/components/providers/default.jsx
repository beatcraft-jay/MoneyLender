import React from 'react';

export const DefaultProviders = ({ children }) => {
  return (
    // Add global providers here, e.g., ThemeProvider, QueryClientProvider, etc.
    // For now, it's a simple wrapper; expand as needed.
    <>{children}</>
  );
};