import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '@server/users';

@Entity('docenti') //TODO: check ER model
export class DocenteEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    titolo: string; 

    @Column({ type: 'varchar', length: 100 })
    dipartimento: string;

    @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @Column()
    userId: number; 
}