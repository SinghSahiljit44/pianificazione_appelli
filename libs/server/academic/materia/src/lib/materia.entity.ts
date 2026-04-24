import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { DocenteEntity } from '@server/docente';
import { CorsoDiLaureaEntity } from '@server/corso-di-laurea';
import { AppelloEntity } from '@server/appello';

@Entity('materie')
export class MateriaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    nome: string;

    @Column({ type: 'int' })
    cfu: number;

    @Column({ type: 'varchar', length: 20, unique: true })
    codice: string; // es. "INF-01"

    @Column({ nullable: true })
    docenteId?: number;

    @Column()
    corsoId: number;

    @ManyToOne(() => CorsoDiLaureaEntity, (corso) => corso.materie, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'corsoId' })
    corso: CorsoDiLaureaEntity;

    @OneToMany(() => AppelloEntity, (appello) => appello.materia)
    appelli: AppelloEntity[];

    @ManyToOne(() => DocenteEntity, { onDelete: 'SET NULL', nullable: true }) //rivedere onDelete
    @JoinColumn({ name: 'docenteId' })
    docente?: DocenteEntity;
}