import styled from 'styled-components';

export const DropContainer = styled.div`
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

  &.is-active {
    border-color: #5a49db;
    background: #f5f3ff;
  }

  &.is-rejected {
    border-color: #d14343;
    background: #fff7f7;
  }
`;

export const UploadMessage = styled.p`
  margin: 12px 0 0;
  color: #26324b;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
`;
