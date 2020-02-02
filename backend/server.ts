const web = require('moleculer-web')
const moleculer = require('moleculer')
const brokerConfig = require('./moleculer.config')

const broker = new moleculer.ServiceBroker(brokerConfig)
broker.loadServices('src/services', '**/**.service.ts')
broker.start()
