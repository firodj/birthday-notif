import express, { Express, Request, Response , Application } from 'express';
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"

const app: Application = express();
const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server for Birthday Notif');
});

app.post('/demo', async (req: Request, res: Response) => {
    console.log("Inserting a new user into the database...")
    const user = new User()
    user.firstName = "Timber"
    user.lastName = "Saw"
    user.birthdayDate = "1980-02-20"
    user.timezone = "Asia/Jakarta"

    await AppDataSource.manager.save(user)

    console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")
})

AppDataSource.initialize().then(async () => {
    app.listen(port, () => {
        console.log(`Server is Fire at http://localhost:${port}`);
    });
}).catch(error => console.log(error))
