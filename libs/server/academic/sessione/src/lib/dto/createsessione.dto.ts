import { SegreteriaEntity } from "@server/segreteria";
import { AppelloEntity } from "@server/appello";

export class CreateSessioneDto {
    nome: string;
    dataInizio: Date;
    dataFine: Date;
    creataDa: SegreteriaEntity;
    appelli: AppelloEntity[];
}
