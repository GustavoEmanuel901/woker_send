import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import Input from '../../components/Input';
import api from '../../services/api';
import type { ExtractedInfo } from '../../components/FileList';
import { useCurrentPage } from '../../context/CurrentPageContext';
import { useFormInitialInfo } from '../../context/FormInitialInfoContext';
import { apiError } from '../../utils/apiError';
import {
  Actions,
  BackButton,
  ErrorBanner,
  FormCard,
  FormDescription,
  FormGrid,
  FormHeader,
  FormTitle,
  PrimaryButton,
  SectionLabel,
  TextArea,
  TextAreaField,
  TextAreaLabel,
  Wrapper,
} from './styles';

export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  jobtitle: string;
  abstract: string;
}

const toFormValues = (values?: ExtractedInfo): UserFormData => ({
  name: values?.name ?? '',
  email: values?.email ?? '',
  phone: values?.phone ?? '',
  jobtitle: values?.jobtitle ?? '',
  abstract: values?.abstract ?? '',
});

export default function UserForm() {
  const [submitError, setSubmitError] = useState('');
  const { currentPage, setCurrentPage } = useCurrentPage();
  const { formInitialInfo, setFormInitialInfo } = useFormInitialInfo();
  const initialValues = formInitialInfo?.initialValues;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    mode: 'onBlur',
    defaultValues: toFormValues(initialValues),
  });

  useEffect(() => {
    if (currentPage === 'form') {
      setSubmitError('');
      reset(toFormValues(initialValues));
    }
  }, [currentPage, formInitialInfo?.fileId, initialValues, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError('');

    try {
      await api.post('/users', {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        jobtitle: values.jobtitle.trim() || undefined,
        abstract: values.abstract.trim() || undefined,
        ...(formInitialInfo?.fileId !== undefined && { file: { id: formInitialInfo.fileId } }),
      });

      setFormInitialInfo({
        ...formInitialInfo,
        confirmationEmail: values.email.trim(),
      });
      setCurrentPage('final');
    } catch (error) {
      const message = apiError(error, 'Não foi possível concluir o cadastro. Tente novamente.');
      setSubmitError(message);
    }
  });

  return (
    <Wrapper>
      <FormHeader>
        <SectionLabel>Woker Send · Currículo anexado</SectionLabel>
        <FormTitle>Complete seu cadastro</FormTitle>
        <FormDescription>
          Confira as informações extraídas do currículo e preencha o que estiver faltando.
        </FormDescription>
      </FormHeader>

      <FormCard onSubmit={onSubmit}>
        {submitError && <ErrorBanner role="alert">{submitError}</ErrorBanner>}

        <FormGrid>
          <Input
            label="Nome completo"
            name="name"
            placeholder="Digite seu nome completo"
            autoComplete="name"
            required
            register={register}
            validation={{
              required: 'Informe seu nome.',
              minLength: { value: 2, message: 'O nome deve ter pelo menos 2 caracteres.' },
              maxLength: { value: 120, message: 'O nome deve ter no máximo 120 caracteres.' },
            }}
            error={errors.name}
          />

          <Input
            type="email"
            label="E-mail"
            name="email"
            placeholder="voce@exemplo.com"
            autoComplete="email"
            required
            register={register}
            validation={{
              required: 'Informe seu e-mail.',
              maxLength: { value: 254, message: 'O e-mail deve ter no máximo 254 caracteres.' },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Informe um e-mail válido.',
              },
            }}
            error={errors.email}
          />

          <Input
            type="tel"
            label="Telefone"
            name="phone"
            placeholder="(11) 99999-9999"
            autoComplete="tel"
            register={register}
            validation={{
              maxLength: { value: 20, message: 'O telefone deve ter no máximo 20 caracteres.' },
              validate: (value) =>
                !value ||
                (/^\+?[\d\s().-]{8,20}$/.test(value) && value.replace(/\D/g, '').length >= 8) ||
                'Informe um telefone válido.',
            }}
            error={errors.phone}
          />

          <Input
            label="Cargo de interesse"
            name="jobtitle"
            placeholder="Ex.: Analista de sistemas"
            register={register}
            validation={{
              maxLength: { value: 120, message: 'O cargo deve ter no máximo 120 caracteres.' },
            }}
            error={errors.jobtitle}
          />

          <TextAreaField>
            <TextAreaLabel htmlFor="abstract">Resumo profissional</TextAreaLabel>
            <TextArea
              id="abstract"
              rows={5}
              maxLength={2000}
              placeholder="Conte um pouco sobre sua experiência e seus objetivos."
              aria-invalid={Boolean(errors.abstract)}
              $hasError={Boolean(errors.abstract)}
              {...register('abstract', {
                maxLength: {
                  value: 2000,
                  message: 'O resumo deve ter no máximo 2000 caracteres.',
                },
              })}
            />
            {errors.abstract && <ErrorBanner role="alert">{errors.abstract.message}</ErrorBanner>}
          </TextAreaField>
        </FormGrid>

        <Actions>
          <BackButton type="button" onClick={() => setCurrentPage('home')} disabled={isSubmitting}>
            Voltar
          </BackButton>
          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando cadastro…' : 'Concluir cadastro'}
          </PrimaryButton>
        </Actions>
      </FormCard>
    </Wrapper>
  );
}
