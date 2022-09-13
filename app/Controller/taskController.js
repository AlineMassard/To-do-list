const Task  = require('../models/tasks')

const taskController = {

    getAllTasks: async function (req, res) {
        try {
            const tasks = await Task.findAll({
                order: [
                    ['position', 'ASC']
                ]
            });
            res.status(200).json(tasks);
        } catch (error) {
            console.log(error)
            res.status(500).json({message: error.message});
        }
    },

    updateOneTask: async function(req, res) {
        try {
            const taskId = Number(req.params.id);
            const updateTask = await Task.findByPk(taskId);

            if(!updateTask) {
                const error = new Error (`Task not found with id ${taskId}`);
                return res.status(404).json({message: error.message})
            }

            const { name, position, color, finish } = req.body;

            if (name) {
                updateTask.name = name;
            };

            if (position) {
                updateTask.position = position;
            };

            if (color) {
                updateTask.color = color;
            };

            if (finish) {
                updateTask.finish = finish;
            };

            await updateTask.save();

            res.status(200).json(updateTask);
        } catch (error) {
            console.log(error);
            res.status(500).json({message: error.message});
        }
    },

    createOneTask: async function(req, res) {
        try {
            console.log(req.body);
            const { name, color } = req.body;
           
            if(!name) {
                const error = new Error ('Name property is missing');
                return res.status(400).json({message: error.message});
            }; 

            const newTask = Task.build ({
                name, 
                color
            });

            if(color) {
                newTask.color = color
            };

            await newTask.save();

            res.status(201).json(newTask);

        } catch (error) {
            console.log(error);
            res.status(500).json({message: error.message});
        }
    },

    deleteOneTask: async function(req, res) {
        try {
            const taskId = Number(req.params.id);
            const task = await Task.findByPk(taskId);

            if(!task) {
                const error = new Error (`Task not found with id ${taskId}`);
                return res.status(404).json({message: error.message})
            };

            await task.destroy();

            const tasks = await Task.findAll();
            res.status(200).json(tasks)

        } catch (error) {
            console.log(error);
            res.status(500).json({message: error.message});
        }
    }

};

module.exports = taskController;