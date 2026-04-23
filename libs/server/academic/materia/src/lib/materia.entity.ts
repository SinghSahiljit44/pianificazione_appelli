import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DocenteEntity } from '@server/docente';
import { CorsoDiLaureaEntity } from '@server/corso-di-laurea';

@Entity('materie')
export class MateriaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    nome: string;

    @Column({ type: 'int' })
    cfu: number;

    @Column({ type: 'varchar', length: 20, unique: true })
    codice: string; // es. "ING-INF/05"

    @ManyToOne(() => DocenteEntity, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'docenteId' })
    docente!: DocenteEntity;

    @Column({ nullable: true })
    docenteId!: number;

    // Relazione con Corso di Laurea
    @ManyToOne(() => CorsoDiLaureaEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'corsoId' })
    corso: CorsoDiLaureaEntity;

    @Column()
    corsoId: number;
}