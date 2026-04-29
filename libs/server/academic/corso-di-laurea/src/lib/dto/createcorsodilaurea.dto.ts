import { MateriaEntity } from "@server/materia";

export class CreateCorsoDiLaureaDto {
    nome: string;
    descrizione?: string;
    durataAnni?: number;
    materie?: MateriaEntity[];
}
