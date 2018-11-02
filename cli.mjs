import fs from 'fs'
import termKit from 'terminal-kit'
import util from 'util'

const { promisify } = util
const { terminal } = termKit
const { promises: { writeFile , readFile } } = fs

const twilio = {}

terminal.inputField = promisify(terminal.inputField)
terminal.yesOrNo = promisify(terminal.yesOrNo)
terminal.on('key', (key) => {
  if (key === 'CTRL_C') {
    terminal.red('CTRL-C detected...\n') ;
    process.exit()
  }
}) 

export const getOptions = async () => {
  // Look for saved options
  if (fs.existsSync('config.json')) {
    terminal('Would to use the saved options? [Y|n]\n')
    const result = await terminal.yesOrNo({ yes: [ 'y', 'ENTER' ], no: [ 'n' ] })
    if (result) {
      try {
        const data = await readFile('config.json')
        return JSON.parse(data.toString())
      } catch (err) {
        throw err
      }
    }
  }

  // Prompts
  try {
    terminal('\nTwilio account sid: ')
    twilio.sid = await terminal.inputField()
    terminal('\nTwilio auth token: ')
    twilio.token = await terminal.inputField()
    await writeFile('config.json', JSON.stringify(twilio))
  } catch (err) {
    throw err
  }

  return twilio
}
