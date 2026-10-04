import { MdAutoAwesome, MdCheckCircle, MdErrorOutline, MdOpenInNew, MdPictureAsPdf } from 'react-icons/md';

import {
  EmptyState,
  Entry,
  ErrorStatus,
  ExtractButton,
  ExtractedData,
  ExtractedField,
  FileActions,
  FileCopy,
  FileInfo,
  FileLink,
  InlineError,
  List,
  Preview,
  Row,
  Status,
  SuccessIcon,
} from './styles';

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
    return <EmptyState>Nenhum arquivo enviado ainda.</EmptyState>;
  }

  return (
    <List>
      <Entry key={files.clientId}>
        <Row>
          <FileInfo>
            <Preview aria-hidden="true">
              <MdPictureAsPdf size={21} />
            </Preview>
            <FileCopy>
              <strong title={files.name}>{files.name}</strong>
              <span>{formatFileSize(files.size)}</span>
            </FileCopy>
          </FileInfo>

          <FileActions>
            {files.status === 'uploading' && <Status>Enviando…</Status>}
            {files.status === 'error' && (
              <ErrorStatus role="status">
                <MdErrorOutline aria-hidden="true" />
                {files.error || 'Falha no envio'}
              </ErrorStatus>
            )}
            {files.status === 'ready' && files.url && (
              <FileLink
                href={files.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Abrir ${files.name}`}
                title="Abrir arquivo"
              >
                <MdOpenInNew size={19} />
              </FileLink>
            )}
            {files.status === 'ready' && (
              <ExtractButton
                type="button"
                disabled={files.extractionStatus === 'loading'}
                onClick={() => onExtract(files)}
              >
                <MdAutoAwesome aria-hidden="true" />
                {files.extractionStatus === 'loading' ? 'Extraindo…' : 'Extrair dados'}
              </ExtractButton>
            )}
            {files.extractionStatus === 'done' && (
              <SuccessIcon>
                <MdCheckCircle size={21} aria-label="Dados extraídos" />
              </SuccessIcon>
            )}
          </FileActions>
        </Row>

        {files.extractionStatus === 'error' && (
          <InlineError role="alert">
            {files.extractionError}
          </InlineError>
        )}

        {files.extracted && (
          <ExtractedData>
            {extractedFields.map(({ key, label }) => {
              const value = files.extracted?.[key];
              return value ? (
                <ExtractedField key={key}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </ExtractedField>
              ) : null;
            })}
          </ExtractedData>
        )}
      </Entry>
    </List>
  );
}
