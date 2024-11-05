import axios from "axios";
import {PRODUCTS_API} from "../constant/api.jsx";

export const fetchProducts = async (name = "", categoryId = "") => {
    try {
        const response = await axios.get(PRODUCTS_API, {
            params: {
                name: name || undefined,
                categoryId: categoryId || undefined,
            }
        });
        return response.data;
    } catch (error) {
        throw new Error("Lỗi khi gọi API sản phẩm: " + error);
    }
}

export const fetchProductId = async (id) => {
    try {
        let response = await axios.get(`${PRODUCTS_API}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error("Lỗi khi lấy sản phẩm theo ID: " + error);
    }
}

export const addProduct = async (product) => {
    try {
        await axios.post(PRODUCTS_API, product);
        return true;
    } catch (error) {
        throw new Error("Lỗi khi thêm sản phẩm: " + error);
        return false;
    }
}

export const updateProduct = async (id, updatedProduct) => {
    try {
        await axios.put(`${PRODUCTS_API}/${id}`, updatedProduct);
        return true;
    } catch (error) {
        throw new Error("Lỗi khi cập nhật sản phẩm: " + error);
    }
}

export const deleteProduct = async (id) => {
    try {
        await axios.delete(`${PRODUCTS_API}/${id}`);
    } catch (error) {
        throw new Error("Lỗi khi xóa sản phẩm: " + error);
    }
}