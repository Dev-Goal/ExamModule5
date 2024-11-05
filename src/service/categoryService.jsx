import axios from "axios";
import {CATEGORIES_API} from "../constant/api.jsx";

export const fetchCategories = async () => {
    try {
        let response = await axios.get(CATEGORIES_API);
        return response.data
    } catch (error) {
        throw new Error("Lỗi khi gọi API danh mục: " + error);
    }
}