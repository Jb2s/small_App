import axios from "axios";

export const toggleSubTask = async (taskId,subtaskId, token) => {
    const url = `${import.meta.env.VITE_URL_API}/subtasks/${taskId}/toggleSubtasks/${subtaskId}`; 
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

export const removeSubTask = async (taskId, subtaskId, token) => {
    
    const url = `${import.meta.env.VITE_URL_API}/subtasks/${taskId}/deleteSubtasks/${subtaskId}`; 

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




