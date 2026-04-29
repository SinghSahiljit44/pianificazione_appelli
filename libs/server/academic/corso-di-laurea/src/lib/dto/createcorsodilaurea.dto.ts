import { MateriaEntity } from "@server/materia";

export class CreateCorsoDiLaureaDto {
    codice: string;
    nome: string;
    descrizione?: string;
    durataAnni?: number;
    materie?: MateriaEntity[];
}
