import { parseDay } from './date.util';

describe('parseDay', () => {
  it('normalizza una stringa ISO (mezzanotte UTC) al giorno, a mezzanotte locale', () => {
    const d = parseDay('2025-08-01T00:00:00.000Z');
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(7); // agosto
    expect(d.getDate()).toBe(1);
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
  });

  it('legge il giorno dai caratteri: un orario tardo non sposta il giorno', () => {
    const d = parseDay('2025-08-01T23:30:00.000Z');
    expect(d.getMonth()).toBe(7);
    expect(d.getDate()).toBe(1);
  });

  it('normalizza un Date (colonna entità) a mezzanotte locale, togliendo l’ora', () => {
    const entity = new Date(2025, 7, 1, 14, 45); // 1 ago 14:45 locale
    const d = parseDay(entity);
    expect(d.getDate()).toBe(1);
    expect(d.getMonth()).toBe(7);
    expect(d.getHours()).toBe(0);
  });

  it('è idempotente', () => {
    const once = parseDay('2025-08-01T00:00:00.000Z');
    const twice = parseDay(once);
    expect(twice.getTime()).toBe(once.getTime());
  });

  it('DTO (stringa UTC-mid) ed entità (Date local-mid) dello stesso giorno collassano allo stesso valore', () => {
    const fromDto = parseDay('2025-08-01T00:00:00.000Z');
    const fromEntity = parseDay(new Date(2025, 7, 1)); // come lo rende pg
    expect(fromDto.getTime()).toBe(fromEntity.getTime());
  });

  describe('scenari dei bug backend risolti', () => {
    it('bug 1: la finestra di inserimento include il giorno di dataFineInserimento', () => {
      const dataFineInserimento = new Date(2026, 6, 1); // colonna date -> local mid
      const oggi = parseDay(new Date(2026, 6, 1, 10, 0)); // ultimo giorno, ore 10
      expect(oggi > parseDay(dataFineInserimento)).toBe(false); // non chiuso
      expect(oggi <= parseDay(dataFineInserimento)).toBe(true); // aperto
    });

    it('bug 2: un appello nel giorno dataFine rientra nel range; il giorno dopo no', () => {
      const dataFine = new Date(2026, 6, 31); // colonna date -> local mid
      const appelloUltimoGiorno = parseDay('2026-07-31T00:00:00.000Z'); // DTO UTC-mid
      expect(appelloUltimoGiorno > parseDay(dataFine)).toBe(false); // dentro
      const appelloOltre = parseDay('2026-08-01T00:00:00.000Z');
      expect(appelloOltre > parseDay(dataFine)).toBe(true); // fuori
    });
  });
});
