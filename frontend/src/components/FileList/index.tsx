import { MdAutoAwesome, MdCheckCircle, MdErrorOutline, MdOpenInNew, MdPictureAsPdf } from 'react-icons/md';

import { FileInfo, Preview } from './styles';

export interface ExtractedInfo {
  name?: string;
  phone?: string;
  email?: string;
  jobtitle?: string;
  abstract?: string;
}

export interface UploadedFile {
  clientId: string;
  id?: number;
  name: string;
  size: number;
  url?: string;
  status: 'uploading' | 'ready' | 'error';
  error?: string;
  extractionStatus: 'idle' | 'loading' | 'done' | 'error';
  extractionError?: string;
  extracted?: ExtractedInfo;
  file?: File;
}

interface FileListProps {
  files: UploadedFile | null | undefined;
  onExtract: (file: UploadedFile) => void;
}

const extractedFields: { key: keyof ExtractedInfo; label: string }[] = [
  { key: 'name', label: 'Nome' },
  { key: 'email', label: 'E-mail' },
  { key: 'phone', label: 'Telefone' },
  { key: 'jobtitle', label: 'Cargo' },
  { key: 'abstract', label: 'Resumo' },
];

function formatFileSize(size: number): string {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileList({ files, onExtract }: FileListProps) {
  if (!files) {
    return <p className="empty-state">Nenhum arquivo enviado ainda.</p>;
  }

  return (
    <ul className="file-list">
      <li className="file-entry" key={files.clientId}>
        <div className="file-row">
          <FileInfo>
            <Preview aria-hidden="true">
              <MdPictureAsPdf size={21} />
            </Preview>
            <div className="file-copy">
              <strong title={files.name}>{files.name}</strong>
              <span>{formatFileSize(files.size)}</span>
            </div>
          </FileInfo>

          <div className="file-actions">
            {files.status === 'uploading' && <span className="status">Enviando…</span>}
            {files.status === 'error' && (
              <span className="status status-error" role="status">
                <MdErrorOutline aria-hidden="true" />
                {files.error || 'Falha no envio'}
              </span>
            )}
            {files.status === 'ready' && files.url && (
              <a
                className="icon-link"
                href={files.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Abrir ${files.name}`}
                title="Abrir arquivo"
              >
                <MdOpenInNew size={19} />
              </a>
            )}
            {files.status === 'ready' && (
              <button
                className="extract-button"
                type="button"
                disabled={files.extractionStatus === 'loading'}
                onClick={() => onExtract(files)}
              >
                <MdAutoAwesome aria-hidden="true" />
                {files.extractionStatus === 'loading' ? 'Extraindo…' : 'Extrair dados'}
              </button>
            )}
            {files.extractionStatus === 'done' && (
              <MdCheckCircle className="success-icon" size={21} aria-label="Dados extraídos" />
            )}
          </div>
        </div>

        {files.extractionStatus === 'error' && (
          <p className="inline-error" role="alert">
            {files.extractionError}
          </p>
        )}

        {files.extracted && (
          <dl className="extracted-data">
            {extractedFields.map(({ key, label }) => {
              const value = files.extracted?.[key];
              return value ? (
                <div className="extracted-field" key={key}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ) : null;
            })}
          </dl>
        )}
      </li>
    </ul>
  );
}
