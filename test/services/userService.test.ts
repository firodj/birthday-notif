import { UserService }  from "../../src/services/userService"

test('validate create user', async () => {
    const svc = new UserService()

    expect(() => svc.validateUserParam({})).toThrow('firstName should not empty')
    expect(() => svc.validateUserParam({ firstName: "Thomas" })).toThrow('invalid timezone undefined')
    expect(() => svc.validateUserParam({ firstName: "Thomas", timezone: "Asia/Bali" })).toThrow('invalid timezone Asia/Bali')
    expect(() => svc.validateUserParam({ firstName: "Thomas", timezone: "Asia/Jakarta" })).toThrow('invalid birthday undefined')
    expect(() => svc.validateUserParam({ firstName: "Thomas", timezone: "Asia/Jakarta", birthday: "08-05-1992" })).toThrow('invalid birthday 08-05-1992')
    expect(() => svc.validateUserParam({ firstName: "Thomas", timezone: "Asia/Jakarta", birthday: "1992-05-08" })).toBeTruthy()
})