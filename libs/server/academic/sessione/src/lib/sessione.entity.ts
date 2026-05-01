import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AppelloEntity } from '@server/appello'; 
import { ManyToOne, JoinColumn } from 'typeorm';
import { SegreteriaEntity } from '@server/segreteria';

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

    @Column({ type: 'timestamp' })
    dataInizioInserimento: Date;

    @Column({ type: 'timestamp' })
    dataFineInserimento: Date;

    @Column({ type: 'boolean', default: false }) //what this
    attiva: boolean;

    @OneToMany(() => AppelloEntity, (appello) => appello.sessione)
    appelli: AppelloEntity[];

    @ManyToOne(() => SegreteriaEntity, (segreteria) => segreteria.sessioniGestite, { nullable: true })
    @JoinColumn({ name: 'creataDaId' })
    creataDa: SegreteriaEntity;

}