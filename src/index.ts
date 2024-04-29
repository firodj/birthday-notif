import express, { Express, Request, Response , Application, NextFunction } from 'express';
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import moment from 'moment-timezone';

const app: Application = express();
const port = process.env.PORT || 8000;

function isValidTimezone(timezone: string): boolean {
    return moment.tz.zone(timezone) != null;
}

function isValidDate(datestr: string): boolean {
    var d = moment(datestr, 'YYYY-MM-DD', true);
    return d != null && d.isValid();
}

const jsonErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
		return next(err);
	}
    res.status(500).send({ error: err });
}

app.use(express.json()) // for parsing application/json

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server for Birthday Notif');
});

app.post('/user', (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)

    const { firstName, lastName,  birthday, timezone } = req.body;

    if (!isValidTimezone(timezone)) {
        throw new Error(`invalid timezone ${timezone}`)
    }
    if (!isValidDate(birthday)) {
        throw new Error(`invalid birthday ${birthday}`)
    }

    const user = new User()
    user.firstName = firstName
    user.lastName = lastName
    user.birthday = moment(birthday, "YYYY-MM-DD")
    user.timezone = timezone

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
