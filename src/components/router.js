import { h, Component } from 'preact';

const EMPTY = {};

function getCurrentUrl(customHistory) {
  let url;
  if (customHistory && customHistory.location) {
    url = customHistory.location;
  } else if (customHistory && customHistory.getCurrentLocation) {
    url = customHistory.getCurrentLocation();
  } else {
    url = typeof location !== 'undefined' ? location : EMPTY;
  }
  return `${url.pathname || ''}${url.search || ''}`;
}

export default class Router extends Component {

  constructor(props) {
    super(props);
    if (props.history) {
      customHistory = props.history;
    }

    this.state = {
      url: props.url || getCurrentUrl()
    };

  }

  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
    *	@param {string} event.url	The newly routed URL
    */
  handleRoute = e => {
    this.currentUrl = e.url;
  };

  onChange = e => {

  };

  render() {
    return (
      <div class="app">
        <Header />
        <Router onChange={this.handleRoute}>
          <Home path="/" />
          <Profile path="/profile/" user="me" />
          <Profile path="/profile/:user" />
        </Router>
      </div>
    );
  }
}
