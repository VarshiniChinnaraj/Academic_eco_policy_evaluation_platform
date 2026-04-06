import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/',        label: 'Dashboard', icon: '📊', end: true },
  { to: '/add',     label: 'Add Data',  icon: '➕' },
  { to: '/reports', label: 'Reports',   icon: '📋' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Main Navbar */}
      <Navbar className="gc-navbar" expand="lg" sticky="top">
        <Container fluid>
          {/* Brand */}
          <a href="/" className="gc-brand me-4">
            <span className="leaf-icon">🌿</span>
            <span className="d-none d-sm-inline">Green Campus</span>
          </a>

          {/* Desktop Nav */}
          <Nav className="d-none d-lg-flex me-auto gap-1">
            {NAV_LINKS.map(({ to, label, icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `gc-nav-link${isActive ? ' active' : ''}`}
              >
                {icon} {label}
              </NavLink>
            ))}
          </Nav>

          {/* User & Logout */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
              👤 {user?.name}
            </span>
            <Button
              size="sm"
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                borderRadius: '7px',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              🚪 Logout
            </Button>
          </div>

          {/* Mobile toggle */}
          <Button
            variant="link"
            className="d-lg-none"
            style={{ color: 'white', fontSize: '1.3rem' }}
            onClick={() => setShow(true)}
          >
            ☰
          </Button>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas */}
      <Offcanvas show={show} onHide={() => setShow(false)} placement="end"
        style={{ maxWidth: '260px', background: 'var(--primary-dark)' }}>
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 700 }}>
            🌿 Green Campus
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-flex flex-column gap-2">
            {NAV_LINKS.map(({ to, label, icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `gc-nav-link${isActive ? ' active' : ''}`}
                onClick={() => setShow(false)}
              >
                {icon} {label}
              </NavLink>
            ))}
            <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
              👤 {user?.name}
            </span>
            <button
              className="gc-nav-link text-start"
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              🚪 Logout
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Page Content */}
      <div className="gc-page">
        <Outlet />
      </div>
    </>
  );
}
