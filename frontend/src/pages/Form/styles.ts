import styled from 'styled-components';

export const Wrapper = styled.main`
  width: min(100% - 32px, 760px);
  margin: 0 auto;
  padding: 48px 0;
`;

export const FormHeader = styled.header`
  margin-bottom: 22px;
`;

export const SectionLabel = styled.p`
  margin: 0 0 8px;
  color: #5a49db;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const FormTitle = styled.h1`
  margin: 0 0 8px;
  color: #182238;
  font-size: clamp(26px, 4vw, 34px);
  letter-spacing: -0.035em;
`;

export const FormDescription = styled.p`
  margin: 0;
  color: #69758b;
  font-size: 14px;
  line-height: 1.6;
`;

export const FormCard = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 28px;
  border: 1px solid #e7eaf1;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(28, 39, 67, 0.05);

  @media (max-width: 600px) {
    padding: 20px;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;

  & > * {
    min-width: 0;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const TextAreaField = styled.div`
  grid-column: 1 / -1;
`;

export const TextAreaLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
`;

interface TextAreaProps {
  $hasError: boolean;
}

export const TextArea = styled.textarea<TextAreaProps>`
  display: block;
  width: 100%;
  min-height: 120px;
  padding: 12px 16px;
  resize: vertical;
  border: 1px solid ${({ $hasError }) => ($hasError ? '#ef4444' : '#d1d5db')};
  border-radius: 8px;
  background: #fff;
  color: inherit;
  font: inherit;
  font-size: 14px;
  line-height: 1.5;
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease;

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => ($hasError ? '#ef4444' : '#3b82f6')};
    box-shadow: 0 0 0 2px
      ${({ $hasError }) => ($hasError ? 'rgba(239, 68, 68, 0.35)' : 'rgba(59, 130, 246, 0.35)')};
  }
`;

export const ErrorBanner = styled.p`
  margin: 0;
  color: #b83232;
  font-size: 13px;
  line-height: 1.5;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 4px;

  @media (max-width: 420px) {
    flex-direction: column-reverse;
  }
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border: 0;
  border-radius: 9px;
  background: #5a49db;
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  transition:
    background 150ms ease,
    opacity 150ms ease;

  &:hover:not(:disabled) {
    background: #4938c5;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`;

export const BackButton = styled.button`
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border: 1px solid #d8dce6;
  border-radius: 9px;
  background: #fff;
  color: #4b5568;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 600;

  &:hover:not(:disabled) {
    background: #f7f8fb;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`;

export const SuccessCard = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 32px;
  border: 1px solid #d8efe3;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(28, 39, 67, 0.05);

  ${FormTitle} {
    color: #176b48;
  }
`;
