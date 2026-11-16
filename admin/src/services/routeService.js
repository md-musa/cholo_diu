import apiClient from "../config/axiosConfig";
export const getAllRoutes = async () => {
    try {
        const data = await apiClient.get("/routes");
        console.log("Res", data);
        return data;
    } catch (error) {
        console.log(error);
    }
};
