import { useEffect, useState } from 'react';
import { Container, Card, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { authService } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        setUser(response.data?.data || response.data);
      } catch (err) {
        setError('Error cargando el perfil.');
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
        <Spinner animation="grow" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold">Mi Perfil</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="dash-card mx-auto" style={{ maxWidth: '600px' }}>
        <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 text-center">
           <div className="profile-avatar mb-3" style={{width: '120px', height: '120px', fontSize: '4rem'}}>
              {user?.nombre?.charAt(0) || user?.email?.charAt(0) || 'U'}
           </div>
           <h3 className="fw-bold m-0">{user?.nombre || user?.firstName || 'Usuario Detalle'}</h3>
           <p className="text-muted">{user?.email}</p>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3 px-0">
              <span className="fw-semibold text-muted">ID de Usuario</span>
              <span>{user?.id || user?._id || 'N/A'}</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center py-3 px-0">
              <span className="fw-semibold text-muted">Correo</span>
              <span>{user?.email}</span>
            </ListGroup.Item>
             <ListGroup.Item className="d-flex justify-content-between align-items-center py-3 px-0">
              <span className="fw-semibold text-muted">Rol</span>
               <span className="badge bg-primary rounded-pill px-3 py-2">
                {user?.rol || user?.role || 'ESTANDAR'}
              </span>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
