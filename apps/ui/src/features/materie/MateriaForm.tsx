import type { Dispatch, SetStateAction } from 'react';
import Select from '../../components/Select';
import type { Materia, CreateMateriaDto } from './materie.api';
import type { Docente } from '../docenti/docenti.api';
import type { CorsoLaurea } from '../corsi-laurea/corsi-laurea.api';
import s from '../layouts/admin.module.css';
import ls from './MateriePage.module.css';

interface CorsoRow {
  corsoId: string;
  anno: string;
}

export interface MateriaFormValues {
  nome: string;
  cfu: string;
  docenteId: string;
  corsi: CorsoRow[];
}

export const EMPTY_MATERIA_FORM: MateriaFormValues = { nome: '', cfu: '', docenteId: '', corsi: [] };

export function toMateriaForm(m: Materia): MateriaFormValues {
  return {
    nome: m.nome,
    cfu: String(m.cfu),
    docenteId: m.docente ? String(m.docente.id) : '',
    corsi: (m.corsi ?? []).map((mc) => ({
      corsoId: String(mc.corso.id),
      anno: String(mc.anno),
    })),
  };
}

export function validateMateriaForm(form: MateriaFormValues): string | null {
  for (const row of form.corsi) {
    if (!row.corsoId) {
      return 'Seleziona un corso di laurea per ogni riga, oppure rimuovila.';
    }
  }
  return null;
}

export function buildMateriaPayload(form: MateriaFormValues): CreateMateriaDto {
  return {
    nome: form.nome,
    cfu: Number(form.cfu),
    ...(form.docenteId ? { docenteId: Number(form.docenteId) } : {}),
    corsi: form.corsi.map((r) => ({ corsoId: Number(r.corsoId), anno: Number(r.anno) })),
  };
}

function annoOptions(corsoId: string, corsiLaurea: CorsoLaurea[]) {
  const corso = corsiLaurea.find((c) => String(c.id) === corsoId);
  const max = corso?.durataAnni ?? 5;
  return Array.from({ length: max }, (_, i) => i + 1);
}

interface Props {
  value: MateriaFormValues;
  onChange: Dispatch<SetStateAction<MateriaFormValues>>;
  docenti: Docente[];
  corsiLaurea: CorsoLaurea[];
}

export default function MateriaForm({ value, onChange, docenti, corsiLaurea }: Props) {
  function setField<K extends keyof MateriaFormValues>(key: K, v: MateriaFormValues[K]) {
    onChange((f) => ({ ...f, [key]: v }));
  }

  function addCorsoRow() {
    onChange((f) => ({ ...f, corsi: [...f.corsi, { corsoId: '', anno: '1' }] }));
  }

  function removeCorsoRow(i: number) {
    onChange((f) => ({ ...f, corsi: f.corsi.filter((_, idx) => idx !== i) }));
  }

  function updateCorsoRow(i: number, field: keyof CorsoRow, v: string) {
    onChange((f) => {
      const corsi = [...f.corsi];
      corsi[i] = { ...corsi[i], [field]: v };
      if (field === 'corsoId') corsi[i].anno = '1';
      return { ...f, corsi };
    });
  }

  return (
    <>
      <div className={s.field}>
        <label className={s.label}>Nome materia</label>
        <input
          className={s.input}
          placeholder="es. Analisi Matematica I"
          value={value.nome}
          onChange={(e) => setField('nome', e.target.value)}
          required
        />
      </div>

      <div className={s.fieldRow}>
        <div className={s.field}>
          <label className={s.label}>CFU</label>
          <input
            type="number"
            min="1"
            max="30"
            className={s.input}
            placeholder="es. 6"
            value={value.cfu}
            onChange={(e) => setField('cfu', e.target.value)}
            required
          />
        </div>
        <div className={s.field}>
          <label className={s.label}>Docente</label>
          <Select
            className={s.select}
            value={value.docenteId}
            onChange={(v) => setField('docenteId', v)}
            placeholder="— Nessuno —"
            options={docenti.map((d) => ({
              value: String(d.id),
              label: d.user.name,
            }))}
          />
        </div>
      </div>

      <div className={s.field}>
        <label className={s.label}>Corsi di laurea</label>
        {value.corsi.length > 0 && (
          <div className={ls.corsoRows}>
            {value.corsi.map((row, i) => {
              const opts = annoOptions(row.corsoId, corsiLaurea);
              return (
                <div key={i} className={ls.corsoRow}>
                  <Select
                    className={s.select}
                    value={row.corsoId}
                    onChange={(v) => updateCorsoRow(i, 'corsoId', v)}
                    placeholder="— Seleziona corso —"
                    options={corsiLaurea.map((c) => ({
                      value: String(c.id),
                      label: c.nome,
                    }))}
                  />
                  <Select
                    className={`${s.select} ${ls.annoSelect}`}
                    value={row.anno}
                    onChange={(v) => updateCorsoRow(i, 'anno', v)}
                    disabled={!row.corsoId}
                    options={opts.map((a) => ({
                      value: String(a),
                      label: `Anno ${a}`,
                    }))}
                  />
                  <button
                    type="button"
                    className={ls.removeRowBtn}
                    onClick={() => removeCorsoRow(i)}
                    aria-label="Rimuovi"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <button
          type="button"
          className={ls.addRowBtn}
          onClick={addCorsoRow}
          disabled={corsiLaurea.length === 0}
        >
          + Aggiungi corso di laurea
        </button>
        {corsiLaurea.length === 0 && (
          <p className={s.hint}>Nessun corso di laurea disponibile. Creane uno prima.</p>
        )}
      </div>
    </>
  );
}
