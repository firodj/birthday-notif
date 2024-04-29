import express, { Express, Request, Response , Application, NextFunction } from 'express';
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import { UserService }  from "./services/userService"

import moment from 'moment-timezone';

const app: Application = express();
const port = process.env.PORT || 8000;

const jsonErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
		return next(err);
	}
    console.log(err)
    let msg = "undefined error"
    if (err.stack) {
        msg = err.stack
    }
    if (typeof err.toString === "function") {
		msg =  err.toString();
	}
    res.status(500).send({ error: msg });
}

app.use(express.json()) // for parsing application/json

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server for Birthday Notif');
});

app.post('/user', (req: Request, res: Response, next: NextFunction) => {
    const svc = new UserService()

    svc.validateCreateUser(req.body)

    const user = svc.newCreateUser(req.body)

    AppDataSource.manager.save(user).then((user: User) => {
        console.log("Saved a new user with id: " + user.id)
        const data = {
            userId: user.id
        }
        res.status(201).send(data)
    }).catch(errors => {
        next(errors)
    });
});

app.post('/demo', async (req: Request, res: Response) => {
    console.log("Inserting a new user into the database...")
    const user = new User()
    user.firstName = "Timber"
    user.lastName = "Saw"
    user.birthday = moment("1980-02-20")
    user.timezone = "Asia/Jakarta"

    await AppDataSource.manager.save(user)

    console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")
})

app.use(jsonErrorHandler)

AppDataSource.initialize().then(async () => {
    app.listen(port, () => {
        console.log(`Server is Fire at http://localhost:${port}`);
    });
}).catch(error => console.log(error))
