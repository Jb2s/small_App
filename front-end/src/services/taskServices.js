import axios from "axios";
  
  export const addTaskWithSubTasks = async (taskData, token) => {
    const url = `${import.meta.env.VITE_URL_API}/tasks/addTask`;
  
    try {
        const payload = {
            title: taskData.title,
            description: taskData.description,
            completed: taskData.completed,
            isShared: taskData.isShared,
            subTasks: Array.isArray(taskData.subTasks) ? taskData.subTasks.map(subtask => ({
                title: subtask.title
            })) : []
        };
        console.log(payload);

        const response = await axios.post(url, payload, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
            
        });
        return response.data;
    } catch (error) {
        console.error('taskService.addTaskWithSubTasks.error >> ', error);
        throw error.response ? error.response.data : error;
    }
  };

  export const updateTaskWithSubTasks = async (taskData, token) => {
    const url = `${import.meta.env.VITE_URL_API}/tasks/updateTask/${taskData.taskId}`; 

    try {
        const payload = {
            title: taskData.title,
            description: taskData.description,
            completed: taskData.completed,
            subTasks: Array.isArray(taskData.subTasks) ? taskData.subTasks.map(subtask => ({
                id: subtask.id, 
                title: subtask.title
            })) : []
        };

        console.log(payload);

        const response = await axios.put(url, payload, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('taskService.updateSubTasks.error >> ', error);
        throw error.response ? error.response.data : error;
    }
};

export const getUserTasks = async (token) => {
    const url = `${import.meta.env.VITE_URL_API}/tasks/getTasks`; 

    try {
        const response = await axios.get(url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            }
        });
        return response.data; 
    } catch (error) {
        console.error('taskService.getUserTasks.error >> ', error);
        throw error.response.data; 
    }
};

export const getSharedTasks = async (token) => {
    const url = `${import.meta.env.VITE_URL_API}/tasks/getSharedTasks`; 

    try {
        const response = await axios.get(url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            }
        });
        return response.data; 
    } catch (error) {
        console.error('taskService.getUserTasks.error >> ', error);
        throw error.response.data; 
    }
};

export const toggleTask = async (taskId, token) => {
    const url = `${import.meta.env.VITE_URL_API}/tasks/${taskId}/toggle`; 
    try {
        const response = await axios.put(url, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        return response.data; 
    } catch (error) {
        console.error('Erreur lors du basculement de la tâche:', error); 
        throw error.response.data;
    }
    
};

export const toggleSharedTask = async (taskId, token) => {
    const url = `${import.meta.env.VITE_URL_API}/tasks/${taskId}/toggleSharedTask`; 
    try {
        const response = await axios.put(url, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        return response.data; 
    } catch (error) {
        console.error('Erreur lors du partage de la tâche:', error); 
        throw error.response.data;
    }
    
};

export const removeTask = async (taskId, token) => {
    
    const url = `${import.meta.env.VITE_URL_API}/tasks/deleteTask/${taskId}`; 

    try {
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        return response.data; 
    } catch (error) {
        console.error('Erreur lors de la suppression de la tâche:', error); 
        throw error.response.data;

    }
};





