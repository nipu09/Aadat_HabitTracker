import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Unhandled UI error:", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="grid min-h-screen place-items-center bg-canvas p-6 text-center">
        <div>
          <h1 className="font-display text-4xl">Something went wrong.</h1>
          <p className="mt-3 text-muted">Please reload the page. If it keeps happening, try again later.</p>
          <button type="button" className="btn_ppl mt-6" onClick={() => window.location.assign("/")}>
            Reload
          </button>
        </div>
      </div>
    );
  }
}
