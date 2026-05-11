import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AppelloEntity } from '@server/appello'; 
import { ManyToOne, JoinColumn } from 'typeorm';

@Entity('sessioni')
export class SessioneEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nome: string; 

    @Column({ type: 'date' })
    dataInizio: Date;

    @Column({ type: 'date' })
    dataFine: Date;

    @Column({ type: 'date' })
    dataInizioInserimento: Date;

    @Column({ type: 'date' })
    dataFineInserimento: Date;

    @OneToMany(() => AppelloEntity, (appello) => appello.sessione)
    appelli: AppelloEntity[];

}