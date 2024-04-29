import moment from 'moment-timezone';
import { User } from "../entity/User"

export class UserService {
    isValidTimezone(timezone: string): boolean {
        return moment.tz.zone(timezone) != null;
    }

    isValidDate(datestr: string): boolean {
        var d = moment(datestr, 'YYYY-MM-DD', true);
        return d != null && d.isValid();
    }

    validateUserParam(body: any) {
        const { firstName,  birthday, timezone } = body;

        if (typeof firstName != 'string' || firstName == '') {
            throw new Error(`firstName should not empty`)
        }
        if (!this.isValidTimezone(timezone)) {
            throw new Error(`invalid timezone ${timezone}`)
        }
        if (!this.isValidDate(birthday)) {
            throw new Error(`invalid birthday ${birthday}`)
        }
    }

    applyUser(user: User, body: any): User {
        const { firstName, lastName,  birthday, timezone } = body;

        user.firstName = firstName
        user.lastName = lastName
        user.birthday = moment(birthday, "YYYY-MM-DD")
        user.timezone = timezone

        return user
    }
}