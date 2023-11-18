import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
    const [credenciales, setCredenciales] = useState({ login: '', contrasena: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginChange = (event) => {
        const { name, value } = event.target;
        setCredenciales({ ...credenciales, [name]: value });
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('http://90.77.217.53:3333/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credenciales),
            });

            if (response.ok) {
                onLoginSuccess();
            } else {
                alert('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleLoginSubmit}>
                <input
                    type="text"
                    name="login"
                    value={credenciales.login}
                    onChange={handleLoginChange}
                    placeholder="Login"
                />
                <input
                    type="password"
                    name="contrasena"
                    value={credenciales.contrasena}
                    onChange={handleLoginChange}
                    placeholder="Contraseña"
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
                </button>
            </form>
        </div>
    );
};

export default Login;