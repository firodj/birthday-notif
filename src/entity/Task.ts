import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne } from "typeorm"
import { User } from "./User"
import moment from 'moment';

export enum TaskStatus {
    READY = "ready",
    DONE = "done",
    FAIL = "fail",
}

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

    @Column({
        default: TaskStatus.READY,
    })
    status: string

    @Column({
        type: 'integer',
        default: 0,
    })
    attempts: number

    @Column({
        nullable: true,
    })
    lastAttempt: string

    @Column({
        nullable: true
    })
    lastError: string
}
