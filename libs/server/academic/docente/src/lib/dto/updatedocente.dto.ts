import { UserEntity } from "@server/users";
import { AppelloEntity } from "../../../../appello/src/lib/appello.entity";

export class UpdateDocenteDto {
  titolo?: string;
  dipartimento?: string;
  user?: UserEntity;
  appelli?: AppelloEntity[]; // da controllare come aggiornare
}