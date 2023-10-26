import * as React from "react";
import styles from "./SFlorida.module.scss";
import { ISFloridaProps } from "./ISFloridaProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { sp } from "@pnp/sp/presets/all";
import MainComponent from "./MainComponent";

export default class SFlorida extends React.Component<ISFloridaProps, {}> {
  constructor(prop: ISFloridaProps) {
    super(prop);
    sp.setup({
      spfxContext: this.props.context,
    });
  }
  public render(): React.ReactElement<ISFloridaProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
    } = this.props;

    return (
      <section>
        <MainComponent context={this.props.context} />
      </section>
    );
  }
}
