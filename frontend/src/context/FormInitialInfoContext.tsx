import { createContext, useContext, useState, type ReactNode } from 'react';

import type { ExtractedInfo } from '../components/FileList';

export interface FormInitialInfo {
  fileId: number;
  initialValues?: ExtractedInfo;
  confirmationEmail?: string;
}

interface FormInitialInfoContextData {
  formInitialInfo: FormInitialInfo | undefined;
  setFormInitialInfo: (info: FormInitialInfo | undefined) => void;
}

const FormInitialInfoContext = createContext<FormInitialInfoContextData | undefined>(undefined);

export function FormInitialInfoProvider({ children }: { children: ReactNode }) {
  const [formInitialInfo, setFormInitialInfo] = useState<FormInitialInfo>();

  return (
    <FormInitialInfoContext.Provider value={{ formInitialInfo, setFormInitialInfo }}>
      {children}
    </FormInitialInfoContext.Provider>
  );
}

export function useFormInitialInfo() {
  const context = useContext(FormInitialInfoContext);

  if (!context) {
    throw new Error('useFormInitialInfo deve ser usado dentro de FormInitialInfoProvider.');
  }

  return context;
}
