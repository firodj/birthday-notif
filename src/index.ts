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
    const userRepository = AppDataSource.getRepository(User)

    svc.validateCreateUser(req.body)

    const user = svc.newCreateUser(req.body)

    userRepository.save(user).then((user: User) => {
        console.log("Saved a new user with id: " + user.id)
        const data = {
            userId: user.id
        }
        res.status(201).send(data)
    }).catch(errors => {
        next(errors)
    });
});

app.delete('/user/:userId', (req: Request, res: Response, next: NextFunction) => {
    const userRepository = AppDataSource.getRepository(User)
    const userId = parseInt(req.params?.userId)
    if (!userId) {
        return res.status(401).send({error: "Not found"})
    }

    userRepository.findOneBy({ id: userId }).then((user: User | null) => {
        if (!user) {
            return Promise.reject(new Error("Not found"))
        }
        return user
    }).then((user: User) => {
        return userRepository.delete({ id: user.id })
    }).then((result) => {
        res.send({affected: result.affected})
    }).catch(errors => {
        next(errors)
    });
});

app.use(jsonErrorHandler)

AppDataSource.initialize().then(async () => {
    app.listen(port, () => {
        console.log(`Server is Fire at http://localhost:${port}`);
    });
}).catch(error => console.log(error))
