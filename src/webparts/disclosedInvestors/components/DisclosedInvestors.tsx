import * as React from "react";
// import styles from "./DisclosedInvestors.module.scss";
import { IDisclosedInvestorsProps } from "./IDisclosedInvestorsProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { sp } from "@pnp/sp/presets/all";
import DisclosedDetail from "./DisclosedDetail";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import { ThemeProvider, PartialTheme, createTheme } from "@fluentui/react";

const myTheme = createTheme({
  palette: {
    themePrimary: "#69797e",
    themeLighterAlt: "#f8f9fa",
    themeLighter: "#e4e9ea",
    themeLight: "#cdd5d8",
    themeTertiary: "#9fadb1",
    themeSecondary: "#78888d",
    themeDarkAlt: "#5d6c70",
    themeDark: "#4f5b5f",
    themeDarker: "#3a4346",
    neutralLighterAlt: "#faf9f8",
    neutralLighter: "#f3f2f1",
    neutralLight: "#edebe9",
    neutralQuaternaryAlt: "#e1dfdd",
    neutralQuaternary: "#d0d0d0",
    neutralTertiaryAlt: "#c8c6c4",
    neutralTertiary: "#a19f9d",
    neutralSecondary: "#605e5c",
    neutralPrimaryAlt: "#3b3a39",
    neutralPrimary: "#323130",
    neutralDark: "#201f1e",
    black: "#000000",
    white: "#ffffff",
  },
});
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

    return (
      <ThemeProvider theme={myTheme}>
        <DisclosedDetail context={this.props.context} />
      </ThemeProvider>
    );
  }
}
