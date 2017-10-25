import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { SimpleRouter } from './router'
import Service from '../lib/service'

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

  render() {
    return (
      <div id="app">
        balala
        {/* <Header />
        <Router onChange={this.handleRoute}>

        </Router> */}
      </div>
    )
  }
}
