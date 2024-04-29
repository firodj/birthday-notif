import moment from 'moment-timezone';
import { User } from "../entity/User"
import { Task } from "../entity/Task"

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

    processTask(task: Task) {
        // TODO:
        // ensure task user loaded
        // perform send api to: https://email-service.digitalenvision.com.au/api-docs/
        // if OK, set task status DONE:
        // - add another task by find next schedule (next year)
        // if error:
        // - increase attempts
        // - if attempts exceeded maximum (let say a day), set task status FAIL, otherwise
        // - update scheduledAt for next trial eg. next 1 hour
        // - update lastAttempt to current time, and lastError to store error message
        // - task status READY
    }
}
