import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '@server/users';

@Entity('segreteria_profili')
export class SegreteriaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    ufficio: string; // es. "Ufficio Didattica", "Segreteria Studenti"

    @Column({ type: 'varchar', length: 50, nullable: true })
    telefonoInterno: string;

    // Relazione 1:1 con User
    @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @Column()
    userId: number;
}