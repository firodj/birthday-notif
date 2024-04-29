import express, { Express, Request, Response , Application, NextFunction } from 'express';
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import { Task, TaskStatus } from "./entity/Task"
import { UserService }  from "./services/userService"
import { TaskService }  from "./services/taskService"

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

app.get('/user', (req: Request, res: Response, next: NextFunction) => {
    const userRepository = AppDataSource.getRepository(User)
    userRepository.find().then((allUsers: User[]) => {
        res.send(allUsers)
    }).catch(errors => {
        next(errors)
    });
})

app.post('/user', (req: Request, res: Response, next: NextFunction) => {
    const svc = new UserService()
    const taskSvc = new TaskService(AppDataSource)
    const userRepository = AppDataSource.getRepository(User)
    const taskRepository = AppDataSource.getRepository(Task)

    svc.validateUserParam(req.body)

    const user = new User()
    svc.applyUser(user, req.body)

    const data = {
        userId: 0,
        taskId: 0,
    }

    userRepository.save(user).then((user: User) => {
        console.log("Saved a new user with id: " + user.id)
        data.userId = user.id
        return taskSvc.createNextSchedule(user)
    }).then((task: Task) => {
        console.log("Created a task with id: " + task.id)
        data.taskId = task.id
        res.status(201).send(data)
    }).catch(errors => {
        next(errors)
    });
});

app.delete('/user/:userId', (req: Request, res: Response, next: NextFunction) => {
    const userRepository = AppDataSource.getRepository(User)
    const userId = parseInt(req.params?.userId)
    if (!userId) {
        return res.status(401).send({error: "Invalid id"})
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

app.put('/user/:userId', (req: Request, res: Response, next: NextFunction) => {
    const svc = new UserService()
    const userRepository = AppDataSource.getRepository(User)
    const userId = parseInt(req.params?.userId)
    if (!userId) {
        return res.status(401).send({error: "Invalid id"})
    }

    userRepository.findOneBy({ id: userId }).then((user: User | null) => {
        if (!user) {
            return Promise.reject(new Error("Not found"))
        }
        return user
    }).then((user: User) => {
        svc.validateUserParam(req.body)
        svc.applyUser(user, req.body)
        return userRepository.save(user)
    }).then((user: User) => {
        console.log("Saved an existing user with id: " + user.id)
        const data = {
            userId: user.id
        }
        res.status(200).send(data)
    }).catch(errors => {
        next(errors)
    });

    // TODO: check existing task for changed birthday with taskService
});

app.get('/task', (req: Request, res: Response, next: NextFunction) => {
    const taskRepository = AppDataSource.getRepository(Task)
    taskRepository.find().then((allTasks: Task[]) => {
        res.send(allTasks)
    }).catch(errors => {
        next(errors)
    });
})

app.post('/task/schedule', (req: Request, res: Response, next: NextFunction) => {
    let now = moment().utc()
    const xNow = req.get('X-Now')
    if (typeof xNow == 'string' && xNow != '') {
        const dbgnow = moment(xNow, "YYYY-MM-DD HH:mm Z", true)
        if (dbgnow) {
            now = dbgnow.utc()
            console.log(`X-Now: ${now.format('YYYY-MM-DD HH:mm Z')}`)
        }
    }

    const taskRepository = AppDataSource.getRepository(Task)
    const taskSvc = new TaskService(AppDataSource, now)

    taskRepository.createQueryBuilder("task")
        .leftJoinAndSelect("task.user", "user")
        .where("datetime(task.scheduledAt) <= datetime(:now)", { now: now.toISOString() })
        .andWhere("task.status = :status", { status: TaskStatus.READY })
        .getMany()
    .then((allTasks: Task[]) => {
        let total = 0
        for (var task of allTasks) {
            taskSvc.processTask(task)
            total++
        }
        res.send({ now: now.format('YYYY-MM-DD HH:mm Z'), total })
    }).catch(errors => {
        next(errors)
    });
})

app.use(jsonErrorHandler)

AppDataSource.initialize().then(async () => {
    app.listen(port, () => {
        console.log(`Server is Fire at http://localhost:${port}`);
    });
}).catch(error => console.log(error))
