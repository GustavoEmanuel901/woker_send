import { createContext, useContext, useState, type ReactNode } from 'react';

interface CurrentPageContextData {
  currentPage: 'home' | 'form' | 'final';
  setCurrentPage: (page: 'home' | 'form' | 'final') => void;
}

const CurrentPageContext = createContext<CurrentPageContextData | undefined>(undefined);

export function CurrentPageProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<'home' | 'form' | 'final'>('home');

  return (
    <CurrentPageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </CurrentPageContext.Provider>
  );
}

export function useCurrentPage() {
  const context = useContext(CurrentPageContext);

  if (!context) {
    throw new Error('useCurrentPage deve ser usado dentro de CurrentPageProvider.');
  }

  return context;
}