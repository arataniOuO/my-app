import React, { useState, useEffect } from 'react';

const MiComponente = () => {
    const [datos, setDatos] = useState(null);
    const [nuevoDato, setNuevoDato] = useState({ nombre: '', apellido: '', cash: 0 });
    const [credenciales, setCredenciales] = useState({ login: '', contrasena: '' });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            cargarDatos();
        }
    }, [isLoggedIn]);

    const handleLoginChange = (event) => {
        const { name, value } = event.target;
        setCredenciales({ ...credenciales, [name]: value });
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://90.77.217.53:3333/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credenciales),
            });

            if (response.ok) {
                setIsLoggedIn(true);
            } else {
                alert('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (!isLoggedIn) {
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
                    <button type="submit">Iniciar sesión</button>
                </form>
            </div>
        );
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('http://90.77.217.53:3333/add-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoDato),
        })
        .then(response => response.text())
        .then(data => {
            cargarDatos(); // Recargar los datos después de la subida
            setNuevoDato({ nombre: '', apellido: '', cash: 0 }); // Resetear formulario
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        setNuevoDato({ nombre: '', apellido: '', cash: 0 }); // Resetear formulario
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNuevoDato({ ...nuevoDato, [name]: value });
    };

    const cargarDatos = () => {
        fetch('http://90.77.217.53:3333/data')
            .then(response => response.json())
            .then(data => setDatos(data))
            .catch(error => console.error('Error al acceder a la API:', error));
    };

    const handleDelete = (id) => {
        fetch(`http://90.77.217.53:3333/delete-data/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                cargarDatos(); // Recargar los datos después del borrado
            } else {
                throw new Error('Error al borrar el dato');
            }
        })
        .catch(error => console.error('Error:', error));
    };

    if (!datos) return <div>Cargando...</div>;

    return (
        <div>
            <h1 class="notchoose">Datos de la API</h1>
            <table class="notchoose">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.map(item => (
                        <tr key={item.id}>
                            <td>
                                <button onClick={() => handleDelete(item.id)}>Borrar</button>
                            </td>
                            <td>{item.nombre}</td>
                            <td>{item.apellido}</td>
                            <td>{item.cash.toFixed(2)}</td>
                        </tr>
                    ))}
                    
                </tbody>
            </table>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombre"
                    value={nuevoDato.nombre}
                    onChange={handleChange}
                    placeholder="Nombre"
                />
                <input
                    type="text"
                    name="apellido"
                    value={nuevoDato.apellido}
                    onChange={handleChange}
                    placeholder="Apellido"
                />
                <input
                    type="number"
                    name="cash"
                    value={nuevoDato.cash}
                    onChange={handleChange}
                    placeholder="Cantidad"
                />
                <button type="submit">Agregar</button>
            </form>
        </div>
    );
};

export default MiComponente;
