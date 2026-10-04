import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import Initial from './pages/Initial';
import GlobalStyle from './styles/GlobalStyle';
import { CurrentPageProvider, useCurrentPage } from './context/CurrentPageContext';
import { FormInitialInfoProvider } from './context/FormInitialInfoContext';
import Form from './pages/Form';
import EndPage from './pages/EndPage';

function App() {
  const { currentPage } = useCurrentPage();

  return (
    <>
      <GlobalStyle />
      <Toaster position="top-right" richColors />
      <div hidden={currentPage !== 'home'}>
        <Initial />
      </div>
      <div hidden={currentPage !== 'form'}>
        <Form />
      </div>
      <div hidden={currentPage !== 'final'}>
        <EndPage />
      </div>
    </>
  );
}

const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error('Não foi possível encontrar o elemento #app.');
}

createRoot(rootElement).render(
  <CurrentPageProvider>
    <FormInitialInfoProvider>
      <App />
    </FormInitialInfoProvider>
  </CurrentPageProvider>,
);
