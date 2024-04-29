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

    @Column({
        type: "date",
        transformer: {
            to(value) {
                return moment(value).format('YYYY-MM-DD');
            },
            from(value: moment.Moment) {
                return value
            }
        },
    })
    birthday: moment.Moment

    @Column()
    timezone: string
}
