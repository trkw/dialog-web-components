/**
 * Copyright 2016 Dialog LLC <info@dlg.im>
 */

import type { ConnectionStatus as ConnectionStatusType } from '@dlghq/dialog-types';
import React, { Component } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { Text } from '@dlghq/react-l10n';
import classNames from 'classnames';
import styles from './ConnectionStatus.css';

export type ConnectionStatusProps = {
  className?: string,
  status: ?ConnectionStatusType
};

class ConnectionStatus extends Component {
  props: ConnectionStatusProps;

  shouldComponentUpdate(nextProps: ConnectionStatusProps): boolean {
    return nextProps.status !== this.props.status ||
           nextProps.className !== this.props.className;
  }

  renderContent() {
    const { status } = this.props;
    if (!status) {
      return null;
    }

    const className = classNames(styles.root, this.props.className, styles[status]);

    return (
      <Text
        tagName="div"
        className={className}
        id={`ConnectionStatus.${status}`}
      />
    );
  }

  render() {
    return (
      <CSSTransitionGroup
        transitionName={{
          enter: styles.enter,
          leave: styles.leave,
          appear: styles.appear
        }}
      >
        {this.renderContent()}
      </CSSTransitionGroup>
    );
  }
}

export default ConnectionStatus;
