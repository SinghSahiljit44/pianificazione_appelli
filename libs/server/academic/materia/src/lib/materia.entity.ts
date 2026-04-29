import { Entity, Column, ManyToOne, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { DocenteEntity } from '@server/docente';
import { CorsoDiLaureaEntity } from '@server/corso-di-laurea';
import { AppelloEntity } from '@server/appello';

@Entity('materie')
export class MateriaEntity {
    @PrimaryColumn()
    codice: string;

    @Column({ type: 'varchar', length: 255 })
    nome: string;

    @Column({ type: 'int' })
    cfu: number;

    @ManyToOne(() => CorsoDiLaureaEntity, (corso) => corso.materie, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'corsoId' })
    corso: CorsoDiLaureaEntity;

    @OneToMany(() => AppelloEntity, (appello) => appello.materia)
    appelli: AppelloEntity[];

    @ManyToOne(() => DocenteEntity, { onDelete: 'SET NULL', nullable: true }) //rivedere onDelete
    @JoinColumn({ name: 'docenteId' })
    docente?: DocenteEntity;
}