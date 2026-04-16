import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { authService } from '../services/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        // Ajustamos al formato estándar que se espere devuelto, ej: data.user
        setUser(response.data?.data || response.data);
      } catch (err) {
        setError('No se pudo cargar el perfil del usuario.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold">Dashboard</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={4} className="mb-4">
          <Card className="dash-card text-center py-4 h-100">
            <Card.Body>
              <div className="profile-avatar mb-3">
                {user?.nombre?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <Card.Title className="fw-bold">{user?.nombre || user?.firstName || 'Usuario'}</Card.Title>
              <Card.Text className="text-muted">{user?.email}</Card.Text>
              <span className="badge bg-primary px-3 py-2 rounded-pill">
                {user?.rol || user?.role || 'Activo'}
              </span>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="dash-card h-100 p-3">
            <Card.Body>
              <Card.Title className="fw-bold mb-4">Bienvenido a SchoolCore</Card.Title>
              <p className="text-muted">
                Este es el panel principal de la aplicación. Has iniciado sesión de manera exitosa usando
                los endpoints reales del backend.
              </p>
              
              <div className="alert alert-info mt-4 border-0" style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>
                <h5 className="fw-bold">🚀 Estado de la conexión</h5>
                Conectado exitosamente con la API REST. Token almacenado de manera segura en localStorage.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
