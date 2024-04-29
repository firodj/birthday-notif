# Birthday Notif

Birthday Notif is an application to send birthday notification to the user at 9 am on their local time.

## Design

The API consist of:

* `GET /user` -- to show all users (without paginate).
* `POST /user` -- to add user, with following body as example:

```json
    {
        "firstName": "Timber",
        "lastName": "Lake",
        "birthday": "1990-05-10",
        "timezone": "Asia/Singapore"
    }
```

    Additionally it also create task to send nontification.

* `DELETE /user/:id` -- to remove user.
* `PUT /user/:id` -- to update user with body similar with add user.
* `GET /task` -- list available task
* `POST /task/schedule` -- hitted by hourly cron to start sending notification

The Database connsist of:

* User table, to store user information
* Task table, to store scheduler information
