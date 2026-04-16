import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Se espera el token en la URL (?token=...)
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!token) {
      setError('Token inválido o no existe.');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, password);
      setMsg('Contraseña restablecida correctamente.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-4">
          <h3 className="fw-bold">Nueva Contraseña</h3>
          <p className="text-muted">Ingresa tu nueva contraseña</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {msg && (
          <Alert variant="success">
            {msg} <br/> <Link to="/login" className="fw-bold">Ir al Login</Link>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nueva Contraseña</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Contraseña segura" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Repite la contraseña" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </Form.Group>

          <Button 
            className="w-100 btn-primary-custom py-2 fw-semibold" 
            type="submit" 
            disabled={loading || msg !== ''}
          >
            {loading ? 'Restableciendo...' : 'Restablecer'}
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

export default ResetPassword;
