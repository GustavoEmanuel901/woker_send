import Dropzone from 'react-dropzone';

import { DropContainer, UploadHint, UploadIcon, UploadMessage } from './styles';

interface UploadProps {
  onUpload: (file: File) => void;
  onError: (message: string) => void;
}

export default function Upload({ onUpload, onError }: UploadProps) {
  return (
    <Dropzone
      accept={{ 'application/pdf': ['.pdf'] }}
      maxSize={5 * 1024 * 1024}
      maxFiles={1}
      multiple={false}
      onDrop={(acceptedFiles, rejectedFiles) => {
        const [acceptedFile] = acceptedFiles;

        if (acceptedFile) {
          onUpload(acceptedFile);
        }

        if (rejectedFiles.length > 0) {
          onError('Envie apenas um arquivo PDF de até 5 MB.');
        }
      }}
    >
      {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
        <DropContainer
          {...getRootProps()}
          $isDragActive={isDragActive}
          $isDragReject={isDragReject}
        >
          <input {...getInputProps()} />
          <UploadIcon aria-hidden="true">
            ↑
          </UploadIcon>
          <UploadMessage>
            {isDragReject
              ? 'Esse arquivo não é aceito'
              : isDragActive
                ? 'Solte o PDF aqui'
                : 'Arraste um PDF para cá ou clique para selecionar'}
          </UploadMessage>
          <UploadHint>PDF · até 5 MB</UploadHint>
        </DropContainer>
      )}
    </Dropzone>
  );
}
