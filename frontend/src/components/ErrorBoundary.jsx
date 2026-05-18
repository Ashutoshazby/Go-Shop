import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-padded py-24">
          <div className="surface rounded-lg p-8">
            <h1 className="text-2xl font-black">Something went sideways.</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Refresh the page and try again.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
