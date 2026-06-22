// Contratto di comunicazione frontend ↔ backend.
// Solo interfacce framework-free (niente NestJS / TypeORM / class-validator / React).
// Le date sono `string` (formato wire/JSON).
export * from './lib/corso-laurea';
export * from './lib/docente';
export * from './lib/sessione';
export * from './lib/materia';
export * from './lib/appello';
