import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { authService } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      const { accessToken, refreshToken } = response.data?.data || response.data; // Adapte según la estructura de respuesta real
      
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        navigate('/dashboard');
      } else {
         setError('Token no recibido del servidor');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-4">
          <h2 className="fw-bold">SchoolCore</h2>
          <p className="text-muted">Inicia sesión en tu cuenta</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Ingresa tu correo" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Constraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </Form.Group>

          <Button 
            className="w-100 btn-primary-custom py-2 fw-semibold" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>

          <div className="text-center mt-3">
            <Link to="/forgot-password" className="text-decoration-none" style={{ color: 'var(--primary-color)' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
