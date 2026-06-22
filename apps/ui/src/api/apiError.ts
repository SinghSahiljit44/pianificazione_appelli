// Estrae il messaggio d'errore dalle risposte dell'API (NestJS restituisce
// `message` come stringa o array di stringhe per gli errori di validazione).
export function getApiErrorMessage(err: unknown, fallback = 'Errore durante il salvataggio.'): string {
  const msg = (err as { response?: { data?: { message?: string | string[] } } })
    ?.response?.data?.message;
  return Array.isArray(msg) ? msg.join(', ') : msg ?? fallback;
}
