import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ErrorBoundary
 * A React error boundary that catches render-time errors in its child tree and renders a stable fallback UI.
 */
export default class ErrorBoundary extends React.Component {
  /** Tracks the error state. */
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /** React lifecycle: update state when an error occurs. */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /** React lifecycle: log error details (could be sent to monitoring). */
  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('Uncaught runtime error:', error, errorInfo);
  }

  /** Reset the boundary to attempt a retry. */
  // PUBLIC_INTERFACE
  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.wrap}>
          <div style={styles.card}>
            <div style={styles.icon}>⚠️</div>
            <div style={styles.title}>Something went wrong</div>
            <div style={styles.desc}>An unexpected error occurred. You can try to continue using the app.</div>
            <button onClick={this.reset} style={styles.btn}>Reload View</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const styles = {
  wrap: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: '#F3F4F6',
    color: '#111827',
    padding: 16
  },
  card: {
    width: 'min(520px, 92vw)',
    background: 'white',
    border: '1px solid rgba(17,24,39,0.08)',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 8px 24px rgba(17,24,39,0.08)',
    textAlign: 'center',
    display: 'grid',
    gap: 8
  },
  icon: { fontSize: 36 },
  title: { fontWeight: 800, fontSize: 18 },
  desc: { color: 'rgba(17,24,39,0.7)' },
  btn: {
    marginTop: 6,
    background: '#1E3A8A',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: 700
  }
};
