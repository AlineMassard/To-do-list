const express = require ('express');
const router = express.Router();

const taskController = require ('./controllers/taskController');


// Création des routes CRUD pour créer, afficher, modifier et supprimer une tâche
router.get('/tasks', taskController.getAllTasks);
router.patch('/tasks/:id', taskController.updateOneTask);
router.post('/tasks', taskController.createOneTask);
router.delete('/tasks/:id', taskController.deleteOneTask);

module.exports = router;