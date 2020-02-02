import { Context } from 'moleculer'
import { Action, Service } from 'moleculer-decorators'

const moleculer = require('moleculer')

@Service({ name: 'UserDataService' })
class UserDataService extends moleculer.Service {

    @Action()
    getName(ctx: Context): string {
        return 'Max'
    }
}

export = UserDataService
