/*
 * Copyright (c) (2017) - Aikar's Minecraft Timings Parser
 *
 *  Written by Aikar <aikar@aikar.co>
 *    + Contributors (See AUTHORS)
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */

import React from "react";
import data from "../data";
import TimingRow from "./TimingRow";
import flow from "lodash/flow";
import _fp from "lodash/fp";
import _ from "lodash";
import Plugin from "../data/Plugin";

export default class PluginsView extends React.Component {
  static propTypes = PluginsView.props = {
    children: React.PropTypes.any
  };

  static defaultProps = {};

  constructor(props, ctx) {
    super(props, ctx);
    data.provideTo(this);
  }

  render() {
    if (!this.state.timingHistoryReady) {
      return null;
    }
    let plugins = flow(
      _fp.sortBy(`handler.${sortType}`)
    )(Object.values(data.timingsMaster.plugins).map((plugin) => {
      const handlerId = data.timingsMaster.idmap.handlerNameMap[`${plugin.name}::Combined Total`];
      const handler = handlerId && data.handlerData[handlerId.id];
      return {plugin, handler: handler && handler[data.propTotal] ? handler : null};
    }));
    let results = _.partition(plugins, (p) => p.handler);
    results[0] = results[0].reverse();
    plugins = results[0].concat(results[1]);
    return (
      <div>
        {plugins.map((p) => <PluginRow key={p.plugin.name} handler={p.handler} plugin={p.plugin}/>)}
      </div>
    );
  }
}

class PluginRow extends React.Component {
  static propTypes = PluginRow.props = {
    /**
     * @type {Plugin}
     */
    plugin: React.PropTypes.instanceOf(Plugin).isRequired
  };

  constructor(props, ctx) {
    super(props, ctx);
  }

  render() {
    const pl = this.props.plugin;
    const handler = this.props.handler;
    let website = pl.website;
    if (website && !website.match(/https?:\/\//)) {
      website = "http://" + website;
    }
    return (
      <div className="plugin-row">
        <h5><a href={website ? website : "#"}>{pl.name}</a> <span className="plugin-version">(v{pl.version})</span></h5>
        <span><strong>Authors:</strong> {pl.authors}</span><br />
        <span>{pl.description && pl.description !== "null" ? pl.description : null}</span>
        {handler ? <div className="plugin-timing-row"><TimingRow timingRowDepth={0} handler={handler}/></div> : null}
      </div>
    )
  }
}
