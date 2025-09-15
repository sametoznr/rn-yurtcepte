import React from 'react'
import RootNavigation from './src/navigation/RootNavigation'
import { AuthProvider } from './src/components/AuthContext';

export default function App() {
  return (
    <AuthProvider>

      <RootNavigation />
    </AuthProvider>
  );
}

