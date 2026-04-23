import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sessioni')
export class SessioneEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nome: string; // es. "Sessione Estiva"

    @Column({ type: 'varchar', length: 9 })
    annoAccademico: string; // es. "2023/2024"

    @Column({ type: 'date' })
    dataInizio: Date;

    @Column({ type: 'date' })
    dataFine: Date;

    @Column({ type: 'boolean', default: true })
    attiva: boolean;
}