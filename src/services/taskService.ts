import moment from 'moment-timezone';
import { User } from "../entity/User"

export class TaskService {
    today: moment.Moment

    constructor(today?: moment.Moment) {
        this.today = today ?? moment()
    }

    findNextSchedule(user: User): moment.Moment {
        const mm_dd = user.birthday.format("MM-DD")
        const taskAt = moment.tz(`${this.today.year()}-${mm_dd} 09:00`, user.timezone)
        const hours = taskAt.diff(this.today, 'hours')
        if ((hours ?? 0) < 1) {
            taskAt.year(taskAt.year()+1)
        }
        return taskAt
    }
}