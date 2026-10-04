import { useState, type InputHTMLAttributes } from 'react';
import type { FieldError, RegisterOptions, UseFormRegister } from 'react-hook-form';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

import {
  ErrorMessage,
  Field,
  InputWrapper,
  Label,
  PasswordToggle,
  StyledInput,
} from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  register?: UseFormRegister<any>;
  validation?: RegisterOptions;
  error?: FieldError;
  showPasswordToggle?: boolean;
}

export default function Input({
  type = "text",
  label,
  required = false,
  name,
  register,
  validation,
  error,
  showPasswordToggle = false,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <Field>
      <Label htmlFor={rest.id ?? name}>
        {label} {required && <span>(Obrigatório)</span>}
      </Label>
      <InputWrapper>
        <StyledInput
          id={rest.id ?? name}
          type={inputType}
          $hasError={Boolean(error)}
          $isPassword={isPassword}
          {...rest}
          {...(register ? register(name, validation) : {})}
        />

        {isPassword && showPasswordToggle && (
          <PasswordToggle
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <AiFillEye size={20} />
            ) : (
              <AiFillEyeInvisible size={20} />
            )}
          </PasswordToggle>
        )}
      </InputWrapper>
      {error && <ErrorMessage role="alert">{error.message}</ErrorMessage>}
    </Field>
  );
}