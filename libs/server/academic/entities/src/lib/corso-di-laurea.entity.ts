import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MateriaCorsoEntity } from './materia-corso.entity';

@Entity('corsi_di_laurea')
export class CorsoDiLaureaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    nome: string;

    @Column({ type: 'text', nullable: true })
    descrizione: string;

    @Column({ type: 'int', default: 3 })
    durataAnni: number;

    @OneToMany(() => MateriaCorsoEntity, (mc: MateriaCorsoEntity) => mc.corso)
    materie: MateriaCorsoEntity[];

}