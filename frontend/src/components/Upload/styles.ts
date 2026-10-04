import styled from 'styled-components';

interface DropContainerProps {
  $isDragActive: boolean;
  $isDragReject: boolean;
}

export const DropContainer = styled.div<DropContainerProps>`
  min-height: 172px;
  padding: 24px;
  border: 1px dashed #cbd5e1;
  border-radius: 14px;
  background: #fbfcff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition:
    border-color 160ms ease,
    background 160ms ease;

  &:focus-visible {
    outline: 3px solid rgba(90, 73, 219, 0.24);
    outline-offset: 3px;
  }

  ${({ $isDragActive }) =>
    $isDragActive &&
    `
    border-color: #5a49db;
    background: #f5f3ff;
  `}

  ${({ $isDragReject }) =>
    $isDragReject &&
    `
    border-color: #d14343;
    background: #fff7f7;
  `}
`;

export const UploadMessage = styled.p`
  margin: 12px 0 0;
  color: #26324b;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
`;

export const UploadIcon = styled.span`
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #eeecff;
  color: #5a49db;
  font-size: 24px;
  font-weight: 500;
`;

export const UploadHint = styled.span`
  margin-top: 7px;
  color: #8992a3;
  font-size: 12px;
`;
