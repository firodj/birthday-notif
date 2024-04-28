import { DataSource } from "typeorm"
import { User } from "../../src/entity/User"

export const TestDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    entities: [User],
    synchronize: true,
    logging: false,
})
