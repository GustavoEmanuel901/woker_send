import { useRef, useState } from 'react';
import { MdAutoAwesome, MdDescription } from 'react-icons/md';

import Upload from '../../components/Upload';
import FileList, { type ExtractedInfo, type UploadedFile } from '../../components/FileList';
import { useCurrentPage } from '../../context/CurrentPageContext';
import { useFormInitialInfo } from '../../context/FormInitialInfoContext';
import api from '../../services/api';
import { apiError } from '../../utils/apiError';
import {
  BrandMark,
  Container,
  Content,
  Description,
  Eyebrow,
  FormError,
  HeadingIcon,
  ManualButton,
  PageHeader,
  PageTitle,
  Panel,
  SectionDescription,
  SectionHeading,
  SectionTitle,
} from './styles';

function isRecord(payload: unknown): payload is Record<string, unknown> {
  return typeof payload === 'object' && payload !== null && !Array.isArray(payload);
}

export default function Initial() {
  const [file, setFile] = useState<UploadedFile | undefined>(undefined);
  const [uploadError, setUploadError] = useState('');
  const activeUploadId = useRef<string | undefined>(undefined);
  const { setCurrentPage } = useCurrentPage();
  const { setFormInitialInfo } = useFormInitialInfo();

  const handleUpload = (selectedFile: File) => {
    setUploadError('');
    setCurrentPage('home');
    setFormInitialInfo(undefined);
    const pendingFile: UploadedFile = {
      clientId: crypto.randomUUID(),
      name: selectedFile.name,
      size: selectedFile.size,
      status: 'uploading',
      extractionStatus: 'idle',
      file: selectedFile,
    };

    activeUploadId.current = pendingFile.clientId;
    setFile(pendingFile);

    void (async () => {
      try {
        const data = new FormData();
        data.append('file', selectedFile, selectedFile.name);

        const response = await api.post<unknown>('/files', data);
        const payload: unknown = response.data;

        if (!isRecord(payload) ||
          typeof payload.id !== 'number' ||
          typeof payload.name !== 'string' ||
          typeof payload.size !== 'number' ||
          typeof payload.url !== 'string'
        ) {
          throw new Error('O servidor retornou os dados do arquivo em formato inválido.');
        }

        const { id, name, size, url } = payload;
        if (activeUploadId.current === pendingFile.clientId) {
          setFormInitialInfo({ fileId: id });
        }
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
        const message = apiError(error, 'Não foi possível enviar o arquivo.');
        setFile((currentFile) =>
          currentFile?.clientId === pendingFile.clientId
            ? {
                ...currentFile,
                status: 'error',
                error: message,
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
      const response = await api.post<unknown>(`/files/${file.id}/extract`);
      const payload: unknown = response.data;
      if (!isRecord(payload)) {
        throw new Error('O servidor retornou os dados extraídos em formato inválido.');
      }
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
      if (activeUploadId.current === file.clientId) {
        setFormInitialInfo({ fileId: file.id, initialValues: extracted });
      }
      setCurrentPage('form');
    } catch (error) {
      const message = apiError(error, 'Não foi possível extrair os dados.');
      setFile((currentFile) =>
        currentFile?.clientId === file.clientId
          ? {
              ...currentFile,
              extractionStatus: 'error',
              extractionError: message,
            }
          : currentFile,
      );
    }
  };

  return (
    <Container>
      <Content>
        <PageHeader>
          <BrandMark aria-hidden="true">
            <MdDescription size={24} />
          </BrandMark>
          <div>
            <Eyebrow>Woker Send</Eyebrow>
            <PageTitle>Leitor de currículos</PageTitle>
            <Description>
              Envie um currículo em PDF e extraia as principais informações.
            </Description>

            <ManualButton
              type="button"
              onClick={() => {
                  setFormInitialInfo({});
                  setCurrentPage('form');
              }}
            >
              Preencher cadastro manualmente
            </ManualButton>
            {file?.status !== 'ready' && (
              <SectionDescription>Envie um currículo para iniciar o cadastro.</SectionDescription>
            )}
          </div>
        </PageHeader>

        <Panel aria-labelledby="upload-heading">
          <SectionHeading>
            <div>
              <SectionTitle id="upload-heading">Adicionar currículo</SectionTitle>
              <SectionDescription>O arquivo deve estar em PDF e ter até 5 MB.</SectionDescription>
            </div>
            <HeadingIcon>
              <MdAutoAwesome size={22} aria-hidden="true" />
            </HeadingIcon>
          </SectionHeading>

          <Upload onUpload={handleUpload} onError={setUploadError} />
          {uploadError && (
            <FormError role="alert">
              {uploadError}
            </FormError>
          )}
        </Panel>

        <Panel aria-labelledby="files-heading">
          <SectionHeading>
            <div>
              <SectionTitle id="files-heading">Arquivo enviado</SectionTitle>
             
            </div>
          </SectionHeading>
          <FileList files={file} onExtract={handleExtract} />
        </Panel>

      </Content>
    </Container>
  );
}
