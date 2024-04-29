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

  *firstName* should be exists, *birthday* format is `YYYY-MM-DD`, and *timezone* is to store current user location's timezone. 
  Additionally it also create task to schedule nontification based on current year and birthday month and current user timezoe.
  If birthday this year already passed, it will create for the next year.

* `DELETE /user/:id` -- to remove user.
* `PUT /user/:id` -- to update user with body similar with add user.
* `GET /task` -- list available task/schedule
* `POST /task/schedule` -- hitted by hourly cron to start sending notification for task that already passed and with READY status.

The Database connsist of:

* **User** table, to store user information
* **Task** table, to store scheduler information and failed attempts

## Development

Install dependency:

```sh
$ npm install
```

Running test:

```sh
$ npm run test
```

Running dev server:

```sh
$ npm run dev
```
