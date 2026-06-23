import { Entity, Column, ManyToOne, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DocenteEntity } from '@server/docente';
import { AppelloEntity } from '@server/appello';
import { MateriaCorsoEntity } from './materia-corso.entity';

@Entity('materie')
export class MateriaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    nome: string;

    @Column({ type: 'int' })
    cfu: number;

    @OneToMany(() => MateriaCorsoEntity, (mc) => mc.materia)
    corsi: MateriaCorsoEntity[]; 

    @OneToMany(() => AppelloEntity, (appello) => appello.materia)
    appelli: AppelloEntity[];

    @ManyToOne(() => DocenteEntity, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'docenteId' })
    docente?: DocenteEntity;
}