import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { MateriaEntity } from './materia.entity';
import { CorsoDiLaureaEntity } from '@server/corso-di-laurea';

@Entity('materie_corsi')
@Unique(['materiaId', 'corsoId', 'anno'])
export class MateriaCorsoEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    anno: number;

    @ManyToOne(() => MateriaEntity, (materia) => materia.corsi, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'materiaId' })
    materia: MateriaEntity;

    @ManyToOne(() => CorsoDiLaureaEntity, (corso: CorsoDiLaureaEntity) => corso.materie, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'corsoId' })
    corso: CorsoDiLaureaEntity;
}