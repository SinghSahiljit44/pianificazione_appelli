import { MateriaEntity } from "@server/materia";

export class UpdateCorsoDiLaureaDto {
    descrizione?: string;
    durataAnni?: number;
    materie?: MateriaEntity[];
}
