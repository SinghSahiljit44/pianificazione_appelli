export class CreateMateriaDto {
  nome: string;
  cfu: number;
  docenteId?: number;
  corsi: { corsoId: number; anno: number }[];
}
