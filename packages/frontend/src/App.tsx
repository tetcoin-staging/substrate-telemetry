import * as React from 'react';
import { Types } from '@dotstats/common';
import { Chains, Node, Icon, Tile, Ago } from './components';
import { Connection } from './message';
import { State } from './state';
import { formatNumber } from './utils';

import './App.css';
import nodeIcon from './icons/server.svg';
import nodeTypeIcon from './icons/terminal.svg';
import peersIcon from './icons/broadcast.svg';
import transactionsIcon from './icons/inbox.svg';
import blockIcon from './icons/package.svg';
import blockHashIcon from './icons/file-binary.svg';
import blockTimeIcon from './icons/history.svg';
import lastTimeIcon from './icons/watch.svg';

export default class App extends React.Component<{}, State> {
  public state: State = {
    best: 0 as Types.BlockNumber,
    blockTimestamp: 0 as Types.Timestamp,
    timeDiff: 0 as Types.Milliseconds,
    subscribed: null,
    chains: new Set(),
    nodes: new Map()
  };

  private connection: Promise<Connection>;

  constructor(props: {}) {
    super(props);

    this.connection = Connection.create((changes) => {
      if (changes) {
        this.setState(changes);
      }

      return this.state;
    });
  }

  public render() {
    const { best, blockTimestamp, timeDiff, chains, subscribed } = this.state;

    Ago.timeDiff = timeDiff;

    return (
      <div className="App">
        <Chains chains={chains} subscribed={subscribed} connection={this.connection} />
        <div className="App-header">
          <Tile icon={blockIcon} title="Best Block">#{formatNumber(best)}</Tile>
          <Tile icon={lastTimeIcon} title="Last Block"><Ago when={blockTimestamp} /></Tile>
        </div>
        <table className="App-list">
          <thead>
            <tr>
              <th><Icon src={nodeIcon} alt="Node" /></th>
              <th><Icon src={nodeTypeIcon} alt="Implementation" /></th>
              <th><Icon src={peersIcon} alt="Peer Count" /></th>
              <th><Icon src={transactionsIcon} alt="Transactions in Queue" /></th>
              <th><Icon src={blockIcon} alt="Block" /></th>
              <th><Icon src={blockHashIcon} alt="Block Hash" /></th>
              <th><Icon src={blockTimeIcon} alt="Block Time" /></th>
              <th><Icon src={lastTimeIcon} alt="Last Block Time" /></th>
            </tr>
          </thead>
          <tbody>
          {
            this.nodes().map((props) => <Node key={props.id} {...props} />)
          }
          </tbody>
        </table>
      </div>
    );
  }

  private nodes(): Node.Props[] {
    return Array.from(this.state.nodes.values()).sort((a, b) => b.blockDetails[0] - a.blockDetails[0]);
  }
}