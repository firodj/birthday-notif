import { TestDataSource } from '../utils/database';
import { User } from "../../src/entity/User"
import moment from 'moment-timezone';

test('create user and get', async () => {
    await TestDataSource.initialize();
    const userRepository = TestDataSource.getRepository(User)

    const timber = new User()
    timber.firstName = "Timber"
    timber.lastName = "Saw"
    timber.birthday = moment("2024-02-20")
    timber.timezone = "Asia/Jakarta"

    await userRepository.save(timber)

    const allUsers = await userRepository.find()

    expect(allUsers).toHaveLength(1);
});
