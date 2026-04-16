import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setMsg('Si el correo existe en nuestra base de datos, recibirás un enlace para recuperar tu contraseña.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al intentar recuperar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-4">
          <h3 className="fw-bold">Recuperar Contraseña</h3>
          <p className="text-muted">Ingresa tu correo asociado a la cuenta</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {msg && <Alert variant="success">{msg}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4" controlId="formBasicEmail">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Ej: tu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </Form.Group>

          <Button 
            className="w-100 btn-primary-custom py-2 fw-semibold" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </Button>

          <div className="text-center mt-3">
            <Link to="/login" className="text-decoration-none text-muted">
              Volver al Login
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
