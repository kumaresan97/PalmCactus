import * as React from "react";
import styles from "./DisclosedInvestors.module.scss";
import { IDisclosedInvestorsProps } from "./IDisclosedInvestorsProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { sp } from "@pnp/sp/presets/all";
import DisclosedDetail from "./DisclosedDetail";

export default class DisclosedInvestors extends React.Component<
  IDisclosedInvestorsProps,
  {}
> {
  constructor(prop: IDisclosedInvestorsProps) {
    super(prop);
    sp.setup({
      spfxContext: this.props.context,
    });
  }
  public render(): React.ReactElement<IDisclosedInvestorsProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
    } = this.props;

    return <DisclosedDetail context={this.props.context} />;
  }
}
