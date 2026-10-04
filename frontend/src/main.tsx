import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MdAutoAwesome, MdDescription } from 'react-icons/md';

import Upload from './components/Upload';
import FileList, { type ExtractedInfo, type UploadedFile } from './components/FileList';
import { Container, Content } from './styles';
import './global.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getErrorMessage(payload: unknown, fallback: string): string {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof payload.message === 'string'
  ) {
    return payload.message;
  }

  return fallback;
}

function isRecord(payload: unknown): payload is Record<string, unknown> {
  return typeof payload === 'object' && payload !== null && !Array.isArray(payload);
}

async function readApiResponse(response: Response): Promise<Record<string, unknown>> {
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, `Falha na requisição (${response.status}).`));
  }

  if (!isRecord(payload)) {
    throw new Error('O servidor retornou uma resposta inválida.');
  }

  return payload;
}

function App() {
  const [file, setFile] = useState<UploadedFile | undefined>(undefined);
  const [uploadError, setUploadError] = useState('');

  const handleUpload = (selectedFile: File) => {
    setUploadError('');
    const pendingFile: UploadedFile = {
      clientId: crypto.randomUUID(),
      name: selectedFile.name,
      size: selectedFile.size,
      status: 'uploading',
      extractionStatus: 'idle',
      file: selectedFile,
    };

    setFile(pendingFile);

    void (async () => {
      try {
        const data = new FormData();
        data.append('file', selectedFile, selectedFile.name);

        const response = await fetch(`${API_BASE_URL}/files`, {
          method: 'POST',
          body: data,
        });
        const payload = await readApiResponse(response);

        if (
          typeof payload.id !== 'number' ||
          typeof payload.name !== 'string' ||
          typeof payload.size !== 'number' ||
          typeof payload.url !== 'string'
        ) {
          throw new Error('O servidor retornou os dados do arquivo em formato inválido.');
        }

        const { id, name, size, url } = payload;
        setFile((currentFile) =>
          currentFile?.clientId === pendingFile.clientId
            ? {
                ...currentFile,
                id,
                name,
                size,
                url,
                status: 'ready',
                file: undefined,
              }
            : currentFile,
        );
      } catch (error) {
        setFile((currentFile) =>
          currentFile?.clientId === pendingFile.clientId
            ? {
                ...currentFile,
                status: 'error',
                error: error instanceof Error ? error.message : 'Não foi possível enviar o arquivo.',
                file: undefined,
              }
            : currentFile,
        );
      }
    })();
  };

  const handleExtract = async (file: UploadedFile) => {
    if (file.id === undefined) {
      return;
    }

    setFile((currentFile) =>
      currentFile?.clientId === file.clientId
        ? { ...currentFile, extractionStatus: 'loading', extractionError: undefined }
        : currentFile,
    );

    try {
      const response = await fetch(`${API_BASE_URL}/files/${file.id}/extract`, {
        method: 'POST',
      });
      const payload = await readApiResponse(response);
      const extracted: ExtractedInfo = {};

      for (const field of ['name', 'phone', 'email', 'jobtitle', 'abstract'] as const) {
        if (typeof payload[field] === 'string') {
          extracted[field] = payload[field];
        }
      }

      setFile((currentFile) =>
        currentFile?.clientId === file.clientId
          ? { ...currentFile, extractionStatus: 'done', extracted }
          : currentFile,
      );
    } catch (error) {
      setFile((currentFile) =>
        currentFile?.clientId === file.clientId
          ? {
              ...currentFile,
              extractionStatus: 'error',
              extractionError:
                error instanceof Error ? error.message : 'Não foi possível extrair os dados.',
            }
          : currentFile,
      );
    }
  };

  return (
    <Container>
      <Content className="page">
        <header className="page-header">
          <div className="brand-mark" aria-hidden="true">
            <MdDescription size={24} />
          </div>
          <div>
            <p className="eyebrow">Woker Send</p>
            <h1>Leitor de currículos</h1>
            <p className="page-description">
              Envie um currículo em PDF e extraia as principais informações.
            </p>
          </div>
        </header>

        <section className="panel" aria-labelledby="upload-heading">
          <div className="section-heading">
            <div>
              <h2 id="upload-heading">Adicionar currículo</h2>
              <p>O arquivo deve estar em PDF e ter até 5 MB.</p>
            </div>
            <MdAutoAwesome className="heading-icon" size={22} aria-hidden="true" />
          </div>

          <Upload onUpload={handleUpload} onError={setUploadError} />
          {uploadError && (
            <p className="form-error" role="alert">
              {uploadError}
            </p>
          )}
        </section>

        <section className="panel files-panel" aria-labelledby="files-heading">
          <div className="section-heading">
            <div>
              <h2 id="files-heading">Arquivo enviado</h2>
             
            </div>
          </div>
          <FileList files={file} onExtract={handleExtract} />
        </section>

      </Content>
    </Container>
  );
}

const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error('Não foi possível encontrar o elemento #app.');
}

createRoot(rootElement).render(<App />);
