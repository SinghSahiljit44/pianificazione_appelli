import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('corsi_di_laurea')
export class CorsoDiLaureaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    nome: string;

    @Column({ type: 'varchar', length: 10, unique: true, nullable: false })
    codice: string; 

    @Column({ type: 'text', nullable: true })
    descrizione: string;

    @Column({ type: 'int', default: 3 })
    durataAnni: number;
}