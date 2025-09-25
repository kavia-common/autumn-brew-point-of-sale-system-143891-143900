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

  renderDevDetails() {
    const { error } = this.state || {};
    if (!error) return null;

    // Extract a short portion of the stack to avoid an overly long UI
    const stack = (error.stack || '')
      .split('\n')
      .slice(0, 8) // show only first few lines to hint the cause
      .join('\n');

    return (
      <div style={styles.devBox}>
        <div style={styles.devHeader}>Development diagnostics</div>
        {error.message && (
          <div style={styles.errorMessage}>
            <strong>Message:</strong> {String(error.message)}
          </div>
        )}
        {stack && (
          <details style={styles.details}>
            <summary>View stack trace</summary>
            <pre style={styles.pre}>{stack}</pre>
          </details>
        )}
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV !== 'production';
      return (
        <div style={styles.wrap}>
          <div style={styles.card}>
            <div style={styles.icon}>⚠️</div>
            <div style={styles.title}>Something went wrong</div>
            <div style={styles.desc}>
              An unexpected error occurred. You can try to continue using the app.
            </div>

            {isDev && this.renderDevDetails()}

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
    width: 'min(720px, 92vw)',
    background: 'white',
    border: '1px solid rgba(17,24,39,0.08)',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 8px 24px rgba(17,24,39,0.08)',
    textAlign: 'left',
    display: 'grid',
    gap: 10
  },
  icon: { fontSize: 36, textAlign: 'center' },
  title: { fontWeight: 800, fontSize: 18, textAlign: 'center' },
  desc: { color: 'rgba(17,24,39,0.7)', textAlign: 'center' },
  btn: {
    marginTop: 6,
    background: '#1E3A8A',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: 700,
    justifySelf: 'center'
  },
  devBox: {
    border: '1px solid rgba(17,24,39,0.12)',
    background: 'rgba(220,38,38,0.04)',
    borderRadius: 8,
    padding: 12,
    display: 'grid',
    gap: 8
  },
  devHeader: { fontWeight: 800, color: '#DC2626' },
  errorMessage: {
    padding: '6px 8px',
    background: 'rgba(220,38,38,0.06)',
    borderRadius: 6,
    border: '1px solid rgba(220,38,38,0.15)'
  },
  details: {
    fontSize: 13
  },
  pre: {
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  }
};
