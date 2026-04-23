// libs/academic/appello/src/lib/entities/appello.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MateriaEntity } from '@org/materia';
import { DocenteEntity } from '@server/docente';
import { SessioneEntity } from '@server/sessione'; 

@Entity('appelli')
export class AppelloEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp' })
    dataOra: Date;

    @Column({ type: 'varchar', length: 100 })
    aula: string;

    @Column({ type: 'text', nullable: true }) //Note professore per esame o descrizione, possibile rimozione
    note: string;

    @ManyToOne(() => MateriaEntity, { onDelete: 'CASCADE' }) //se elimino materia elimino tutti gli appelli relativi
    @JoinColumn({ name: 'materiaId' })
    materia: MateriaEntity;

    @Column()
    materiaId: number; //o stringa?

    @ManyToOne(() => DocenteEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'docenteId' })
    docente: DocenteEntity;

    @Column()
    docenteId: number;

    @ManyToOne(() => SessioneEntity, { onDelete: 'CASCADE' }) //stesso comportamento eliminazione materia
    @JoinColumn({ name: 'sessioneId' })
    sessione: SessioneEntity;

    @Column()
    sessioneId: number;
}