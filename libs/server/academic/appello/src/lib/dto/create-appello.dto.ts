export class CreateAppelloDto {
    // La data e l'ora scelte dal docente [cite: 12]
    dataOra: Date;

    // L'aula scelta per l'esame
    aula: string;

    // Corso di laurea (es. «INFLM-I») [cite: 13]
    corsoId: string;

    // Anno di frequenza relativo al corso [cite: 13]
    annoFrequenza: number;

    // ID della materia per cui si fissa l'appello
    materiaId: number;

    // ID della sessione configurata dalla segreteria [cite: 31]
    sessioneId: number;
}