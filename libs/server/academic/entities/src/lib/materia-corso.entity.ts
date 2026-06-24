import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  Relation,
} from 'typeorm';
import { MateriaEntity } from './materia.entity';
import { CorsoDiLaureaEntity } from './corso-di-laurea.entity';

@Entity('materie_corsi')
@Unique(['materia', 'corso', 'anno'])
export class MateriaCorsoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  anno: number;

  @ManyToOne(() => MateriaEntity, (materia) => materia.corsi, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'materiaId' })
  materia: Relation<MateriaEntity>;

  @ManyToOne(
    () => CorsoDiLaureaEntity,
    (corso: CorsoDiLaureaEntity) => corso.materie,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'corsoId' })
  corso: Relation<CorsoDiLaureaEntity>;
}
