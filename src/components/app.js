import { h, Component } from 'preact';
import { Router } from 'preact-router';
import cx from 'classnames'
import { SimpleRouter } from './router'
import Service from '../lib/service'
import Connector from '../lib/connector'
import Style from 'style/main'

const envConfig = process.envConfig

export default class App extends Component {
  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */
  constructor(props, context) {
    super(props, context)
    this.apiService = new Service(this, {})

    this.bootstrap()
  }

  state = { mode: 'fold', isShow: false }

  bootstrap() {
    const { gameServerHost, gameServerPath } = this.props
    this.connector = new Connector(this, {
      gameServerHost: gameServerHost || envConfig.gameServerHost,
      gameServerPath: gameServerPath || envConfig.gameServerPath,
    })
    console.log('bootstrap')
  }

  getChildContext() {
    return {
      apiService: this.apiService,
      config: process.envConfig
    }
  }

  handleRoute = e => {
    this.currentUrl = e.url
  }

  onFoldSidePanel = e => {
    this.setState({
      mode: 'fold',
      isShow: false
    })
    e.stopPropagation()
  }

  onOpenSidePanel = e => {
    this.setState({
      mode: 'unfold'
    })

    setTimeout(() => {
      this.setState({
        isShow: true
      })
    }, 100)
  }

  render() {
    const { mode, isShow } = this.state
    const sidePaneStyles = [Style['game-side-pane']]
    if(isShow) {
      sidePaneStyles.push(Style['entry'])
    }

    return (
      <div id="app" className={cx(Style['app'])}>
        { mode === 'fold' &&
          <div className={cx(Style['app-entry'])} onClick={this.onOpenSidePanel}>
            <div className={cx(Style['float-icon'])}>🎬</div>
          </div>
        }
        {
          mode === 'unfold' &&
          <div className={cx(Style['game-panel'])}>
            <div className={cx(sidePaneStyles)}>
              <div className={cx(Style['app-side-container'])}>
                <div className={cx(Style['app-side-content'])}>
                  liuwei
                </div>
              </div>
              <div className={cx(Style['app-dock'])} onClick={this.onFoldSidePanel}>
                <div className={cx(Style['float-icon'])}>🔒</div>
              </div>
            </div>
          </div>
        }
        {/* <Header />
        <Router onChange={ this.handleRoute }>

        </Router> */}
      </div>
    )
  }
}
