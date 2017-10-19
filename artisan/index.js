// import App from 'app'
// import Router from 'router'

const command = process.argv[2]
const simpleCommander = {
  package() {
    const packageData = require('../artificial/demo.package.json')
    const packs = Object.keys(packageData.devDependencies).join(' ')

    console.log(`cnpm i -D ${packs}`)
  }
}

if (!command) {
  console.log('command not exist')
  process.exit(0)
}

simpleCommander[command].call(null, process.argv.slice(3))


