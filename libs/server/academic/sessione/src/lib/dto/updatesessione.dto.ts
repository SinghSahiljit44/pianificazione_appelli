import { AppelloEntity } from "@server/appello";

export class UpdateSessioneDto {
    nome?: string;
    dataInizio?: Date;
    dataFine?: Date;
    appelli?: AppelloEntity[];
}