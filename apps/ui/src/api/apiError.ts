export function getApiErrorMessage(err: unknown, fallback = 'Errore durante il salvataggio.'): string {
  const msg = (err as { response?: { data?: { message?: string | string[] } } })
    ?.response?.data?.message;
  return Array.isArray(msg) ? msg.join(', ') : msg ?? fallback;
}
