import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MateriaEntity } from './materia.entity';
import { DocenteEntity } from './docente.entity';
import { SessioneEntity } from './sessione.entity';

@Entity('appelli')
export class AppelloEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    data: Date;

    @Column({ type: 'time' })
    ora: string; 

    @Column({ type: 'text' }) 
    aula: string;

    @Column({ type: 'text', nullable: true }) 
    note?: string;

    @ManyToOne(() => SessioneEntity, (sessione) => sessione.appelli, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sessioneId' })
    sessione: SessioneEntity;

    @ManyToOne(() => MateriaEntity, (materia) => materia.appelli, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'materiaId' })
    materia: MateriaEntity;

    @ManyToOne(() => DocenteEntity, (docente) => docente.appelli, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'docenteId' })
    docente: DocenteEntity;
}