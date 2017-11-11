import { h, Component } from 'preact';
import cx from 'classnames'
import Style from './style.scss'

export default class Dock extends Component {

  render() {
    const { isShow, onFoldSidePanel } = this.props
    const sidePaneStyles = [Style['game-side-pane']]
    if(isShow) {
      sidePaneStyles.push(Style['entry'])
    }

    return (
      <div className={cx(Style['game-panel'])}>
        <div className={cx(sidePaneStyles)}>
          <div className={cx(Style['app-side-container'])}>
            <div className={cx(Style['app-side-content'])}>
              liuwei
            </div>
          </div>
          <div className={cx(Style['app-dock'])} onClick={onFoldSidePanel}>
            <div className={cx(Style['float-icon'])}>🔒</div>
          </div>
        </div>
      </div>
    )
  }
}
