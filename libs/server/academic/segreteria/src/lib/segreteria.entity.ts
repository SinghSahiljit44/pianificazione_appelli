import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserEntity } from '@server/users';
import { SessioneEntity } from '@server/sessione';

@Entity('segreteria_profili')
export class SegreteriaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    ufficio: string; // es. "Ufficio Didattica"

    @Column({ type: 'varchar', length: 50, nullable: true })
    telefonoInterno: string; // ???? why in the why would we need a phone number

    @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @OneToMany(() => SessioneEntity, (sessione) => sessione.creataDa)
    sessioniGestite: SessioneEntity[];

}