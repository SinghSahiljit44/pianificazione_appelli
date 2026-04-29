import { UserEntity } from "@server/users";

export class CreateDocenteDto {
    id: number;
    titolo: string;
    dipartimento: string;
    user: UserEntity;
    //quando lo creo, nessuna appello o materia, quindi non li metto nel dto
}
