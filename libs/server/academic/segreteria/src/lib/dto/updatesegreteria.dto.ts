import { SessioneEntity } from "@server/sessione";

export class UpdateSegreteriaDto {
    ufficio?: string;
    telefonoInterno?: string;
    //user?: UserEntity; da controllare
    sessioniGestite?: SessioneEntity[];
}