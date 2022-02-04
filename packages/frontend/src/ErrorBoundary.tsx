import React from 'react';

type State = {
  error: Error | null;
};

type Props = {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return <this.props.fallback error={this.state.error} />;
      }
      return <div>Critical error: {this.state.error.message}</div>;
    }

    return this.props.children;
  }
}
