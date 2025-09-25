import { Link, NavLink, Outlet } from 'react-router-dom';
import { theme } from '../theme';

/**
 * PUBLIC_INTERFACE
 * Layout
 * Primary app shell: header, sidebar, main, footer.
 */
export default function Layout() {
  const styles = getStyles();

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.brandGroup}>
          <div style={styles.brandIcon}>🍁</div>
          <div>
            <div style={styles.brandTitle}>Autumn Brew POS</div>
            <div style={styles.brandSubtitle}>Classic cafe operations</div>
          </div>
        </div>
        <nav style={styles.nav}>
          <NavLink to="/" style={styles.navLink}>Orders</NavLink>
          <NavLink to="/menu" style={styles.navLink}>Menu</NavLink>
          <NavLink to="/sales" style={styles.navLink}>Sales</NavLink>
          <a href="https://reactjs.org" style={styles.navLink} target="_blank" rel="noreferrer">Help</a>
        </nav>
      </header>

      <div style={styles.contentArea}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarTitle}>Categories</div>
          <ul style={styles.categoryList}>
            <li><Link to="/?category=Drinks" style={styles.categoryLink}>Drinks</Link></li>
            <li><Link to="/?category=Bakery" style={styles.categoryLink}>Bakery</Link></li>
            <li><Link to="/?category=Food" style={styles.categoryLink}>Food</Link></li>
            <li><Link to="/?category=Seasonal" style={styles.categoryLink}>Seasonal</Link></li>
          </ul>
          <div style={styles.sidebarNote}>
            Embrace the season with warm flavors and cozy vibes.
          </div>
        </aside>

        <main style={styles.main}>
          <Outlet />
        </main>
      </div>

      <footer style={styles.footer}>
        <div>© {new Date().getFullYear()} Autumn Brew. All rights reserved.</div>
        <div>
          <span style={{ color: theme.colors.secondary }}>●</span> Status: Online
        </div>
      </footer>
    </div>
  );
}

function getStyles() {
  return {
    app: {
      minHeight: '100vh',
      background: theme.colors.background,
      color: theme.colors.text,
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: theme.colors.surface,
      borderBottom: `1px solid ${theme.colors.subtleBorder}`,
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: theme.colors.shadow
    },
    brandGroup: { display: 'flex', alignItems: 'center', gap: 12 },
    brandIcon: {
      fontSize: 28,
      background: theme.gradient,
      borderRadius: 10,
      padding: 6
    },
    brandTitle: { fontWeight: 700 },
    brandSubtitle: { fontSize: 12, color: 'rgba(17,24,39,0.6)' },
    nav: { display: 'flex', gap: 16 },
    navLink: ({ isActive }) => ({
      textDecoration: 'none',
      color: isActive ? theme.colors.primary : 'rgba(17,24,39,0.8)',
      fontWeight: 600,
      padding: '8px 10px',
      borderRadius: 8,
      border: isActive ? `1px solid ${theme.colors.subtleBorder}` : '1px solid transparent',
      background: isActive ? 'rgba(30,58,138,0.06)' : 'transparent'
    }),
    contentArea: {
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      gap: 20,
      padding: 20,
      flex: 1
    },
    sidebar: {
      background: theme.colors.surface,
      border: `1px solid ${theme.colors.subtleBorder}`,
      borderRadius: 12,
      padding: 16,
      boxShadow: theme.colors.shadow,
      height: 'fit-content'
    },
    sidebarTitle: { fontWeight: 700, marginBottom: 8 },
    categoryList: { listStyle: 'none', padding: 0, margin: '8px 0', display: 'grid', gap: 8 },
    categoryLink: {
      textDecoration: 'none',
      color: theme.colors.text,
      background: 'rgba(245,158,11,0.1)',
      padding: '8px 10px',
      borderRadius: 8,
      border: `1px solid ${theme.colors.subtleBorder}`
    },
    sidebarNote: {
      marginTop: 16,
      fontSize: 12,
      color: 'rgba(17,24,39,0.7)'
    },
    main: {
      display: 'grid',
      gap: 20,
      alignContent: 'start'
    },
    footer: {
      background: theme.colors.surface,
      borderTop: `1px solid ${theme.colors.subtleBorder}`,
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  };
}
