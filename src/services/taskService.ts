import moment from 'moment-timezone';
import { User } from "../entity/User"
import { Task, TaskStatus } from "../entity/Task"
import { DataSource } from "typeorm"

export class TaskService {
    today: moment.Moment
    ds: DataSource
    sendmailUrl: string

    constructor(ds: DataSource, today?: moment.Moment) {
        this.ds = ds
        this.today = today ?? moment()
        this.sendmailUrl = 'https://email-service.digitalenvision.com.au/send-email'
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

    createNextSchedule(user: User): Promise<Task> {
        const taskRepository = this.ds.getRepository(Task)
        const taskAt = this.findNextSchedule(user)

        const task = new Task()
        task.user = user
        task.scheduledAt = taskAt
        task.attempts = 0
        task.status = TaskStatus.READY
        return taskRepository.save(task)
    }

    sendEmail(email: string, message: string) {
        return fetch(this.sendmailUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                email, message,
            }),
        })
    }

    createBackoffTime() {
        const min = 10
        const max = 30
        const result = Math.random() * (max - min) + min
        const minutes = Math.floor(result)
        return this.today.clone().add(minutes, 'minutes')
    }

    retryTask(task: Task, errmsg: string): Promise<Task> {
        const taskRepository = this.ds.getRepository(Task)

        if (task.attempts >= 5) {
            task.status = TaskStatus.FAIL
        } else {
            task.lastError = errmsg
            task.status = TaskStatus.READY
            task.scheduledAt = this.createBackoffTime()
        }

        return taskRepository.save(task)
    }

    processTask(task: Task) {
        const taskRepository = this.ds.getRepository(Task)

        let fullname = task.user.firstName
        if (task.user.lastName) fullname += " " + task.user.lastName
        const email = `${task.user.firstName}${task.user.lastName}@example.com`
        const message = `Hey, ${fullname} it's your birthday`

        task.lastAttempt = this.today.utc().toISOString()
        task.lastError = null
        task.attempts++
        task.status = TaskStatus.SENDING

        taskRepository.save(task).then((task: Task) =>{
            return this.sendEmail(email, message)
        }).then((res: Response) => {
            console.log(res.status, email, message)
            if (!res.ok) {
                return this.retryTask(task, `http status ${res.statusText}`)
            }
            task.status = TaskStatus.DONE
            taskRepository.save(task)
            return this.createNextSchedule(task.user)
        }).catch((err) => {
            console.error(err)
            if (err instanceof TypeError) {
                this.retryTask(task, err.toString())
            }
        })
    }
}
