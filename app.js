const express = require('express');
const app = express();
const { sequelize, Tarea } = require('./models');

app.use(express.json());

const PORT = 3000;

// Ruta base
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API is running'
  });
});

// GET /tareas - Obtener todas las tareas
app.get('/tareas', async (req, res) => {
  try {
    const tareas = await Tarea.findAll();
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

// GET /tareas/:id - Obtener una tarea por ID
app.get('/tareas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tarea = await Tarea.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.status(200).json(tarea);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar la tarea' });
  }
});

// POST /tareas - Crear una nueva tarea
app.post('/tareas', async (req, res) => {
  try {
    const { titulo, descripcion, completada } = req.body;

    if (!titulo || titulo.trim() === '') {
      return res.status(400).json({ error: 'El campo titulo es obligatorio' });
    }

    const nuevaTarea = await Tarea.create({
      titulo,
      descripcion,
      completada: completada ?? false
    });

    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
});

// PUT /tareas/:id - Actualizar una tarea existente
app.put('/tareas/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [filasActualizadas] = await Tarea.update(req.body, {
      where: { id }
    });

    if (filasActualizadas === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const tareaActualizada = await Tarea.findByPk(id);
    res.status(200).json(tareaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
});

// DELETE /tareas/:id - Eliminar una tarea
app.delete('/tareas/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const filasEliminadas = await Tarea.destroy({
      where: { id }
    });

    if (filasEliminadas === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});

// Conexión a DB y arranque del servidor
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Modelos sincronizados correctamente.');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('No se pudo iniciar la aplicación:', error);
  });