import axios from "axios";

export const addUser = async (username, email, password) => {
    const url = `${import.meta.env.VITE_URL_API}/users/register`;

    try {
        const response = await axios.post(url, {username, email, password }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            }
        });
        return response.data; 
    } catch (error) {
        console.error('userService.addUser.error >> ', error);
        throw error.response.data; 
    }
};

export const authenticateUser = async (email, password) => {
    const url = `${import.meta.env.VITE_URL_API}/users/login`;

    try {
        const response = await axios.post(url, { email, password }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        console.log('userService.authenticateUser.response >> ', response);
        return response.data; 
    } catch (error) {
        console.error('userService.authenticateUser.error >> ', error);
        throw error.response.data; 
    }
};