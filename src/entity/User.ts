import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm"
import moment from 'moment';

@Entity()
@Index(["firstName", "lastName"], { unique: true })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({ type: "date" })
    birthday: moment.Moment

    @Column()
    timezone: string
}
