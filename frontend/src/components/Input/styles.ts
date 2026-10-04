import styled, { css } from 'styled-components';

interface StyledInputProps {
  $hasError: boolean;
  $isPassword: boolean;
}

export const Field = styled.div``;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  padding: 12px ${({ $isPassword }) => ($isPassword ? '48px' : '16px')} 12px 16px;
  border: 1px solid ${({ $hasError }) => ($hasError ? '#ef4444' : '#d1d5db')};
  border-radius: 8px;
  background: ${({ disabled }) => (disabled ? '#f3f4f6' : '#fff')};
  color: ${({ disabled }) => (disabled ? '#6b7280' : 'inherit')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'text')};
  font: inherit;
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease;

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => ($hasError ? '#ef4444' : '#3b82f6')};
    box-shadow: 0 0 0 2px
      ${({ $hasError }) =>
        $hasError ? css`rgba(239, 68, 68, 0.35)` : css`rgba(59, 130, 246, 0.35)`};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const PasswordToggle = styled.button`
  position: absolute;
  top: 50%;
  right: 12px;
  display: grid;
  padding: 4px;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #6b7280;
  cursor: pointer;

  &:hover {
    color: #374151;
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const ErrorMessage = styled.p`
  margin: 4px 0 0;
  color: #ef4444;
  font-size: 14px;
`;