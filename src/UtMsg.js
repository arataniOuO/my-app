import React, { useState, useEffect } from 'react';
import Login from './Login';

const UtMsg = () => {
    const [datos, setDatos] = useState(null);
    const [nuevoDato, setNuevoDato] = useState({ nombre: '', apellido: '', cash: 0 });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            cargarDatos();
        }
    }, [isLoggedIn]);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const cargarDatos = () => {
        fetch('http://90.77.217.53:3333/data')
            .then(response => response.json())
            .then(data => setDatos(data))
            .catch(error => console.error('Error al acceder a la API:', error));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNuevoDato({ ...nuevoDato, [name]: value });
    };

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

    if (!isLoggedIn) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    if (!datos) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h1 className="notchoose">Datos de la API</h1>
            <table className="notchoose">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Cash</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.map((dato) => (
                        <tr key={dato.id}>
                            <td class="left">{dato.nombre}</td>
                            <td class="left">{dato.apellido}</td>
                            <td class="right">{dato.cash}</td>
                            <td class="center">
                                <button onClick={() => handleDelete(dato.id)}>
                                    Eliminar
                                </button>
                            </td>
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
                    placeholder="Cash"
                />
                <button type="submit">Añadir</button>
            </form>
        </div>
    );
};

export default UtMsg;
