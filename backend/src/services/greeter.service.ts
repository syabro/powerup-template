import { Context } from 'moleculer'
import { Action, Service } from 'moleculer-decorators'
import UserDataService from 'services/user-data.service'

const moleculer = require('moleculer')

@Service({ name: 'greeter' })
class Greeter extends moleculer.Service {

    @Action()
    async hello(ctx: Context) {
        const username = await ctx.call<ReturnType<UserDataService['getName']>>('UserDataService.getName')
        // ctx.superCall(UserDataService, 'getName', params, opts)

        return `Hello, ${username}`
    }
}

export = Greeter
