import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { authService } from '../services/api';

const NavigationBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Error on logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  if (!token) return null; // No renderizamos la nav si no hay login

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard" className="fw-bold">
          🎓 SchoolCore
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/profile">Perfil</Nav.Link>
          </Nav>
          <Nav>
            <Button variant="outline-light" onClick={handleLogout} className="rounded-pill px-4 btn-logout">
              Cerrar Sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
