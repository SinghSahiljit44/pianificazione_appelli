export class CreateAppelloDto {
    data: Date;
    ora: string;
    aula: string;
    note?: string;
    materiaId: number;
    sessioneId: number;
}