import { DataSource } from "typeorm"
import { User } from "../../src/entity/User"
import { Task } from "../../src/entity/Task"

export const TestDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    entities: [User, Task],
    synchronize: true,
    logging: false,
})
