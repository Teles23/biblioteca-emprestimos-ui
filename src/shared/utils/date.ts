import { formatDistance, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const BRAZIL_TIME_ZONE = 'America/Sao_Paulo';

function toDate(value: string | Date): Date {
  return typeof value === 'string' ? parseISO(value) : value;
}

export function formatRelativeDate(date: string | Date): string {
  const parsedDate = toDate(date);
  return formatDistance(parsedDate, new Date(), {
    addSuffix: true,
    locale: ptBR,
  });
}

export function formatDateBR(date: string | Date): string {
  const parsedDate = toDate(date);
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: BRAZIL_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsedDate);
}

export function formatDateLongBR(date: string | Date, includeYear = true): string {
  const parsedDate = toDate(date);
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: BRAZIL_TIME_ZONE,
    day: '2-digit',
    month: 'long',
    ...(includeYear ? { year: 'numeric' } : {}),
  }).format(parsedDate);
}

export function getBrazilHour(reference = new Date()): number {
  const hour = new Intl.DateTimeFormat('pt-BR', {
    timeZone: BRAZIL_TIME_ZONE,
    hour: '2-digit',
    hour12: false,
  }).format(reference);

  return Number(hour);
}

export function getBrazilGreeting(reference = new Date()): string {
  const hour = getBrazilHour(reference);

  if (hour >= 5 && hour < 12) {
    return 'Bom dia';
  }

  if (hour >= 12 && hour < 18) {
    return 'Boa tarde';
  }

  return 'Boa noite';
}
