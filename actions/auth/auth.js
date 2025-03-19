"use server"

import axios from "axios";

export async function createNewUser(name, email, password) {
    try {

        const response = await axios.post("/api/auth/new-user", {
            name,
            email,
            password,
        });

        console.log("Axios Response Data:", response.data); 
        return response.data; 
    } catch (error) {

        if (error.response) {
            console.error("Server Response Data:", error.response.data);
            console.error("Status Code:", error.response.status);
        }

        return {
            success: false,
            message: error.response?.data?.message || "Error occurred while creating user",
        };
    }
}
