import { h, Component } from 'preact';
import { Router } from 'preact-router';
import cx from 'classnames'
import { SimpleRouter } from './router'
import Service from '../lib/service'
import Style from 'style/main'

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
    console.log('let')
  }

  getChildContext() {
    return {
      apiService: this.apiService
    }
  }

  handleRoute = e => {
    this.currentUrl = e.url;
  }

  onOpenSidePanal = e => {
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
          <div className={cx(Style['app-entry'])} onClick={this.onOpenSidePanal}>
            <div className={cx(Style['float-icon'])}>🎬</div>
          </div>
        }
        {
          mode === 'unfold' &&
          <div className={cx(Style['game-panel'])}>
            <div className={cx(sidePaneStyles)}>
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
