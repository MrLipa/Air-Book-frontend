import './Navbar.css';

export const Navbar = () => {
  return (
    <nav className="ab-navbar">
      <div className="ab-navbar-logo">
        <span role="img" aria-label="Plane">✈️</span>
        AIR-BOOK
      </div>

      <ul className="ab-navbar-menu">
        {[
          { label: 'Home', href: '/' },
          { label: 'Help', href: '/help' },
          { label: 'Login', href: '/login' },
          { label: 'Register', href: '/register' },
        ].map(({ label, href }) => (
          <li key={label} className="ab-navbar-item">
            <a href={href} className="ab-navbar-link">{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
