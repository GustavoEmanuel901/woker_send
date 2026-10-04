import axios from 'axios';
import { toast } from 'sonner';

function getResponseMessage(data: unknown): string | undefined {
  if (typeof data !== 'object' || data === null) {
    return undefined;
  }

  if ('message' in data && typeof data.message === 'string') {
    return data.message;
  }

  if ('errors' in data && typeof data.errors === 'object' && data.errors !== null) {
    const firstError = Object.values(data.errors).find(
      (value): value is string => typeof value === 'string',
    );

    return firstError;
  }

  return undefined;
}

export function apiError(error: unknown, fallback = 'Ocorreu um erro na comunicação com o servidor.') {
  const message = axios.isAxiosError(error)
    ? getResponseMessage(error.response?.data) ?? fallback
    : error instanceof Error
      ? error.message
      : fallback;

  if (!axios.isAxiosError(error) || error.response?.status !== 401) {
    toast.error(message);
  }

  return message;
}