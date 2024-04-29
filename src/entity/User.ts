import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from "typeorm"
import { Task }  from './Task'
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
            from(value) {
                return moment(value)
            }
        },
    })
    birthday: moment.Moment

    @Column()
    timezone: string

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[]
}
