import { TaskService }  from "../../src/services/taskService"
import { User } from "../../src/entity/User"
import { TestDataSource } from '../utils/database';
import moment from 'moment-timezone';

test('find next schedule that already passed for current year', async () => {
    const alice = new User()
    alice.firstName = "Alice"
    alice.lastName = "San"
    alice.birthday = moment("1980-02-20")
    alice.timezone = "Asia/Jakarta"

    const today = moment("2024-04-20")
    const svc = new TaskService(TestDataSource, today)
    const taskAt = svc.findNextSchedule(alice)
    expect(taskAt.utc().format("YYYY-MM-DD HH:mm Z")).toEqual("2025-02-20 02:00 +00:00")
})

test('find next schedule that still waiting for current year', async () => {
    const alice = new User()
    alice.firstName = "Alice"
    alice.lastName = "San"
    alice.birthday = moment("1980-02-20")
    alice.timezone = "Asia/Jakarta"

    const today = moment("2024-01-10")
    const svc = new TaskService(TestDataSource, today)
    const taskAt = svc.findNextSchedule(alice)
    expect(taskAt.utc().format("YYYY-MM-DD HH:mm Z")).toEqual("2024-02-20 02:00 +00:00")
})