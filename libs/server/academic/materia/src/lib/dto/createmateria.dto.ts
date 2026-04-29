export class CreateMateriaDto {
    // Nome completo della materia (es. «Informatica 1») [cite: 14]
    nome: string;

    // ID del docente responsabile della materia
    docenteId: number;

    // Codice del corso di laurea a cui la materia appartiene
    corsoId: string;
}