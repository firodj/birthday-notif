import { TestDataSource } from '../utils/database';
import { User } from "../../src/entity/User"
import { Task, TaskStatus } from "../../src/entity/Task"
import moment from 'moment-timezone';

test('create task', async () => {
    await TestDataSource.initialize();
    const userRepository = TestDataSource.getRepository(User)
    const taskRepository = TestDataSource.getRepository(Task)

    const alice = new User()
    alice.firstName = "Alice"
    alice.lastName = "San"
    alice.birthday = moment("1980-02-20")
    alice.timezone = "Asia/Jakarta"

    await userRepository.save(alice)

    const aliceTask = new Task()
    aliceTask.user = alice
    aliceTask.scheduledAt = moment.tz("2025-02-20 05:00", alice.timezone)
    aliceTask.attempts = 0
    aliceTask.status = TaskStatus.READY

    await taskRepository.save(aliceTask)

    const aliceTasked = await taskRepository.findOne({where: {id: aliceTask.id}, relations: { user: true } })

    expect(aliceTasked?.user.firstName).toBe("Alice")
    expect(aliceTasked?.scheduledAt.utc().format("YYYY-MM-DD HH:mm Z")).toEqual("2025-02-19 22:00 +00:00")
})