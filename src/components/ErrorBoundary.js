import React from "react";
import Error from "./Error";
import Page from "./Page";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error) {
    return { error: error.toString() };
  }

  render() {
    if (this.state.error) {
      return (
        <Page>
          <Error error={this.state.error} />
        </Page>
      );
    }

    return this.props.children;
  }
}
