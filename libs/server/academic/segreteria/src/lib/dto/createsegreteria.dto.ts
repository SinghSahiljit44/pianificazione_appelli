import { UserEntity } from "@server/users";
import { SessioneEntity } from "@server/sessione";

export class CreateSegreteriaDto {
    ufficio: string;
    telefonoInterno: string;
    user: UserEntity;
    sessioniGestite: SessioneEntity[];
}
