process.env.root = __dirname;

const ZmqSub = require(`${process.env.root}/src/Sockets/ZmqSub`)
const WsServer = require(`${process.env.root}/src/Sockets/WsServer`)
const Chaincore = require(`${process.env.root}/src/Streams/Chaincore`)

const chains = {}
const config = JSON.parse(require('fs').readFileSync('./config.json'))
const supported = require(`${process.env.root}/supported`)

console.log(`Setting up chains on: [${config.network}] network...`)

Object.keys(config.chains).forEach(chain => {
  if (! Object.keys(supported).includes(chain)) {
    throw new Error(`Unsupported chain: ${chain}`)
  }

  chains[chain] = {
    zmq: new ZmqSub(
      config.chains[chain].zmq.host,
      config.chains[chain].zmq.port
    ),
    tsf: new supported[chain].tsf(config.network)
  }
})

const Stream = new Chaincore(chains, new WsServer(config.socket))