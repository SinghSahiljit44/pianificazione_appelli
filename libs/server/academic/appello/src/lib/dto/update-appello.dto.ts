export class UpdateAppelloDto {
    // Il docente può modificare la data scelta [cite: 16]
    dataOra?: Date;

    // Il docente può modificare l'aula scelta
    aula?: string;

    // Il docente può cambiare la materia o la sessione se ha sbagliato inserimento
    materiaId?: number;
    sessioneId?: number;
    
    // Nota: corsoId e annoFrequenza sono solitamente legati alla materia, 
    // ma li includiamo se il docente ha permessi di modifica ampi
    corsoId?: string;
    annoFrequenza?: number;
}