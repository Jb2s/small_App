import axios from "axios";

export const addTask = async (title, description, token) => {
    const url = `${import.meta.env.VITE_URL_API}/tasks/addTask`;

    try {
        const response = await axios.post(url, { title, description }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('taskService.addTask.error >> ', error);
        throw error.response.data;
    }
};


export const addSubTasks = async (taskId, subTasks, token) => {
    const url = `${import.meta.env.VITE_URL_API}/subtasks/${taskId}/addSubtasks`;

    try {
        const subTaskResponses = await Promise.all(subTasks.map(async (title) => {
            const response = await axios.post(url, { title }, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        }));
        return subTaskResponses;
    } catch (error) {
        console.error('Erreur lors de l\'ajout des sous-tâches :', error);
        throw error.response?.data || { message: 'Une erreur inconnue est survenue.' };
    }
};
