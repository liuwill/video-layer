
export default class Connector {
  constructor(root, opts) {
    const { gameServerHost, gameServerPath } = opts

    this.root = root
    this.conn = null
    this.gameServerHost = gameServerHost
    this.gameServerPath = gameServerPath
  }

  startConn(url) {
    this.conn = new WebSocket(`ws://${gameServerHost}/${gameServerPath}`)
    this.conn.onmessage = function (evt) {
      var messages = evt.data
      console.log(messages)
    }

    this.conn.onclose = function (evt) {
      this.conn = null
      console.log("losing connection")
    }
  }

  sendMessage() {

  }
}
