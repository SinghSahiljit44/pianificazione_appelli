import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MateriaEntity } from '@server/materia';
import { DocenteEntity } from '@server/docente';
import { SessioneEntity } from '@server/sessione'; 

@Entity('appelli')
export class AppelloEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    data: Date;

    @Column({ type: 'time' })
    ora: string; // es. "09:30:00"

    @Column({ type: 'text' }) 
    aula: string;

    @Column({ type: 'text', nullable: true }) 
    note: string;

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