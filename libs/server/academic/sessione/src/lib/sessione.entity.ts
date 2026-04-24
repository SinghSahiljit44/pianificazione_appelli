import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AppelloEntity } from '@server/appello'; 
import { ManyToOne, JoinColumn } from 'typeorm';
import { SegreteriaEntity } from '@server/segreteria';

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
    @OneToMany(() => AppelloEntity, (appello) => appello.sessione)
    appelli: AppelloEntity[];

    @ManyToOne(() => SegreteriaEntity, (segreteria) => segreteria.sessioniGestite, { nullable: true })
    @JoinColumn({ name: 'creataDaId' })
    creataDa: SegreteriaEntity;

    @Column({ nullable: true })
    creataDaId: number;
}