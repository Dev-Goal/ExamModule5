import React, {useEffect, useState} from 'react';
import {fetchCategories} from "../../service/categoryService.jsx";
import {Link} from "react-router-dom";

function CategoryList() {
    let [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategories();
    })

    let loadCategories = async () => {
        try {
            let data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            throw new Error("Lỗi khi tải danh mục: " + error);
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Danh sách danh mục</h1>
            <Link to="/"
                  className="inline-block mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Trở về
            </Link>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-2 text-center">STT</th>
                        <th className="py-3 px-6 text-center">Tên danh mục</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm font-light">
                    {categories.map((category, index) => (
                        <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-center">{index + 1}</td>
                            <td className="py-3 px-6 text-center">{category.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CategoryList;