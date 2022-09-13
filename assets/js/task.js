var app = {

    base_url: 'http://localhost:3000',

    init: function() {

        console.log('app.init!');
        app.addListenerToActions();
        app.getTasksFromAPI();
    },

    addListenerToActions: function() {
        document.querySelector('.add-task').addEventListener('submit', app.createTask);
    },

    getTasksFromAPI: async function() {
        const response = await fetch (`${app.base_url}/tasks`);
        const tasks = await response.json();

        for (const task of tasks) {
            app.makeTaskInDOM(task);
        }
    },

    makeTaskInDOM: function(task) {
        const template = document.querySelector('.template_progress_task');
        const cloneTemplate = document.importNode(template.content, true);
        const taskTemplate = cloneTemplate.querySelector('.task');
        // Récupérer le nom des todo de l'API et les intégrer au HTML
        cloneTemplate.querySelector('.name-task').textContent = task.name;


        taskTemplate.setAttribute('data-task-id', task.id);
        taskTemplate.style.backgroundColor = task.color;
        
        cloneTemplate.querySelector('input[name="name"]').value = task.name;
        
        cloneTemplate.querySelector('.checkbox').addEventListener('click', app.finishTask);
        cloneTemplate.querySelector('.delete').addEventListener('click', app.deleteTask);
        cloneTemplate.querySelector('.pencil').addEventListener('click', app.showUpdateForm);
        cloneTemplate.querySelector('.edit_form').addEventListener('submit', app.updateTask);
        cloneTemplate.querySelector('input[name="color"]').value = task.color;
        if(task.finish) {
            
            app.transformeTask(taskTemplate);
            taskTemplate.querySelector('input[type="checkbox"]').checked = task.finish;
        }
        // Mise en place de sortable
    // 1: On récupère l'élément qui regroupe nos cartes
    const container = document.querySelector('.here');
    //2: on initialise sortable
    new Sortable(container, {
      draggable: '.task', // mentionne l'élément qu'on veut déplacer
      onEnd: app.handleMovePositionTask
    }) 

        document.querySelector('.here').append(cloneTemplate);
    },

    showUpdateForm: function(event) {
        event.target.closest('.task').querySelector('.modal').classList.add('is-active');
    },

    updateTask: async function(event) {
        event.preventDefault();

        const taskForm = new FormData(event.target);

        const taskId = event.target.closest('.task').getAttribute('data-task-id');

        try {
            const response = await fetch (`${app.base_url}/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    name : taskForm.get('name'),
                    color: taskForm.get('color')
                })
            });
            event.target.closest('.task').querySelector('.name-task').textContent = taskForm.get('name');
            event.target.closest('.task').style.backgroundColor = taskForm.get('color');
        } catch (error) {
            console.log(error);
        }

        event.target.closest('.task').querySelector('.modal').classList.remove('is-active');
    },

    transformeTask: function(task) {
        
        task.classList.add('has-background-grey-lighter');
        task.querySelector('.name-task').classList.add('check');
        task.querySelector('.checkbox').setAttribute('disabled', '');
        task.querySelector('.case').setAttribute('disabled', '');
        task.querySelector('.pencil').classList.add('is-hidden');

      document.querySelector('.finish_here').append(task);
    },

    finishTask: async function(event) {
        console.log('finish')
        const taskId = event.target.closest('.task').getAttribute('data-task-id');

        const taskForm = new FormData();
          taskForm.set('id', taskId);
          taskForm.set('finish', 'TRUE');

        try {
            const response = await fetch (`${app.base_url}/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    finish : taskForm.get('finish'),
                })
            });
           
          } catch (error) {
            alert("Problème lors de la mise à jour de la position des cartes")
            console.log(error);
          }
          const task = event.target.closest('.task');
          app.transformeTask(task);
    },
    

    deleteTask: async function(event) {
        
        const taskId = event.target.closest('.task').getAttribute('data-task-id');

        try{
            const response = await fetch (`${app.base_url}/tasks/${taskId}`, {
                method: 'DELETE'
                });
            
            event.target.closest('.task').remove();
        } catch (error) {
            console.log(error);
            alert('Une erreur est survenue lors de la suppression de la carte');
        }
    },


    createTask: async function(event) {
    
        event.preventDefault();

        const taskForm = new FormData(event.target);
        console.log(taskForm.get('name'));
        if(!taskForm.get('name')) {
            alert('Veuillez entrer un nom');
            return;
        };
        try {
        const response = await fetch (`${app.base_url}/tasks`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                name : taskForm.get('name')
            })
        });
        const task = await response.json();

        app.makeTaskInDOM(task);
    } catch(error) {
        alert('Posting task failed');
        console.log(error);
    }
    document.querySelector('.add-task').reset();
    },

    handleMovePositionTask: function(event) {
        // On récupère toutes les tâches, pour connaître leur position
        const tasks = event.from.querySelectorAll('.box');
        app.updateTasksToAPI(tasks); // On met à jour les cartes mais sans l'id de la liste
    },

    updateTasksToAPI: async function(tasks) {
        // Première carte en position 1
        let index = 1;
        for (const task of tasks) {
          // 1: on récupère l'id de la carte pour l'utiliser dans le fetch
          const id = task.dataset.taskId; // Dataset récupère toutes les infos qui commencent par data comme data-card-id, 
          //passe l'attribut d'après en camelCase donc card-id => cardId ou getAttribute
          // 2: On prépare notre formData
        const taskForm = new FormData();
        taskForm.set('id', id);
        taskForm.set('position', index);
          // 3: On appelle l'API pour lui donner la nouvelle position de la carte
        try {
            const response = await fetch (`${app.base_url}/tasks/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    position : taskForm.get('position'),
                })
            });
        } catch (error) {
            alert("Problème lors de la mise à jour de la position des cartes")
            console.log(error);
        }
        index++;
        }
    
    }

    

};

document.addEventListener('DOMContentLoaded', app.init );