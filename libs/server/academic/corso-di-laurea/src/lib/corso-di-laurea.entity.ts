import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { MateriaEntity } from '@server/materia';

@Entity('corsi_di_laurea')
export class CorsoDiLaureaEntity {

    @PrimaryColumn({ type: 'varchar', length: 10, unique: true, nullable: false })
    codice: string; // es. "L-31"

    @Column({ type: 'varchar', length: 255, nullable: false })
    nome: string; // es. "Informatica", "Economia"

    @Column({ type: 'text', nullable: true })
    descrizione: string;

    @Column({ type: 'int', default: 3 })
    durataAnni: number;

    @OneToMany(() => MateriaEntity, (materia) => materia.corso)
    materie: MateriaEntity[];

}