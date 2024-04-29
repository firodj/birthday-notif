import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne } from "typeorm"
import { User } from "./User"
import moment from 'moment';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "datetime",
        transformer: {
            to(value: moment.Moment) {
                return value.utc().format('YYYY-MM-DD HH:mm Z');
            },
            from(value) {
                return moment(value)
            }
        },
    })
    scheduledAt: moment.Moment

    @ManyToOne(() => User, (user) => user.tasks)
    user: User
}
