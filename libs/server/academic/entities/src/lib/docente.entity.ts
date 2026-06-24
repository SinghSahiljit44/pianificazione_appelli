import { Entity, PrimaryGeneratedColumn, OneToMany, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '@server/users';
import { AppelloEntity } from './appello.entity';
import { MateriaEntity } from './materia.entity';

@Entity('docenti')
export class DocenteEntity {
    @PrimaryGeneratedColumn() //it do be number tho
    id: number;

    @Column({ type: 'varchar', length: 100 })
    titolo: string; // es. "Prof. Associato"

    @Column({ type: 'varchar', length: 100 })
    dipartimento: string;

    @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @OneToMany(() => AppelloEntity, (appello) => appello.docente)
    appelli: AppelloEntity[];

    @OneToMany(() => MateriaEntity, (materia) => materia.docente)
    materie: MateriaEntity[];
}