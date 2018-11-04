import http from 'http'
import ngrok from 'ngrok'
import minimist from 'minimist'
import Twilio from 'twilio'
import qs from 'querystring'
import { getOptions } from './cli'

const PORT = 3333
const {
  to,
  from,
  greeting
} = minimist(process.argv.slice(2))
const { VoiceResponse } = Twilio.twiml
const twiml = new VoiceResponse()
if (greeting) {
  twiml.say(greeting)
}
const sound = 'https://dl.dropbox.com/s/ekhj0kkbqnpowvg' +
  '/Rick%20Astley%20-%20Never%20Gonna%20Give%20You%20Up' +
  '%20%281%29.mp3?dl=0'
twiml.play({
  loop: 1
}, sound)
twiml.say('would you like to leave any feedback')
twiml.record({
  maxLength: 3,
  transcribe: true
})

let client, url

const start = async () => {
  const { sid, token } = await getOptions()

  url = await ngrok.connect(PORT)
  client = new Twilio(sid, token)

  await http.createServer((req, res) => {
    if (req.method === 'POST') {
      let body = ''
      req.on('data', (data) => {
        body += data
      })
      req.on('end', async () => {
        const { CallStatus } = qs.parse(body)
        if (CallStatus === 'completed') {
          console.log('Call completed.')
          await makeCall()
        } else {
          console.log(`Call ${CallStatus}.`)
        }
      })
    }
    res.writeHead(200, { 'Content-Type': 'text/xml' })
    res.end(twiml.toString())
  }).listen(PORT, '127.0.0.1')

  await makeCall()
}

const makeCall = async () => {
  console.log('\nMaking a call....')
  const call = await client.api.calls
    .create({
      url,
      to,
      from,
      statusCallback: url,
      statusCallbackMethod: 'POST',
      statusCallbackEvent: [ 'answered', 'completed' ]
    })
};

(async () => {
  try {
    await start()
  } catch (err) {
    console.error(err)
  }
})()
