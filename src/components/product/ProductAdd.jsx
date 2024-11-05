import React, {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {addProduct} from "../../service/productService.jsx";
import {Link, useNavigate} from "react-router-dom";
import {fetchCategories} from "../../service/categoryService.jsx";
import {toast} from "react-toastify";

function ProductAdd() {
    const {register, handleSubmit, setValue, formState: {errors}, reset} = useForm();
    const [categories, setCategories] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        loadCategories();
    })

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setValue("importDate", today);
    }, [setValue]);

    const loadCategories = async () => {
        try {
            let data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            throw new Error("Lỗi khi tải danh mục: " + error);
        }
    }

    const onSubmit = async (values) => {
        try {
            await addProduct(values);
            toast.success("Thêm sản phẩm thành công");
            reset();
            setTimeout(() => {
                navigate("/");
            }, 5000)
        } catch (error) {
            toast.error("Lỗi khi thêm sản phẩm: " + error.message);
        }
    }
    return (
        <div className={"max-w-md mx-auto bg-white p-6 shadow-md rounded-lg"}>
            <div className="mt-4">
                <Link to="/"
                      className="inline-block mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Trở về
                </Link>
            </div>
            <h1 className={"text-2xl font-bold mb-4 text-center"}>Thêm sản phẩm mới</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={"mb-4"}>
                    <label className={"block text-sm font-medium text-gray-700"}>Mã sản phẩm:</label>
                    <input
                        type="text"
                        {...register("productCode", {
                            required: "Mã sản phẩm không được để trống",
                            pattern: {
                                value: /^PROD-\d{4}$/,
                                message: "Mã sản phẩm phải có dạng SP-XXXX với X là các số"
                            }
                        })}
                        className={"mt-1 p-2 border border-gray-300 rounded-md w-full"}
                    />
                    {errors.productCode && <p className={"text-red-500 text-sm"}>{errors.productCode.message}</p>}
                </div>
                <div className={"mb-4"}>
                    <label className={"block text-sm font-medium text-gray-700"}>Tên sản phẩm:</label>
                    <input
                        type="text"
                        {...register("name", {required: "Tên sản phẩm không được để trống"})}
                        className={"mt-1 p-2 border border-gray-300 rounded-md w-full"}
                    />
                    {errors.name && <p className={"text-red-500 text-sm"}>{errors.name.message}</p>}
                </div>

                <div className={"mb-4"}>
                    <label className={"block text-sm font-medium text-gray-700"}>Số lượng:</label>
                    <input
                        type="number"
                        {...register("quantity", {
                            required: "Số lượng không được để trống",
                            min: {
                                value: 1,
                                message: "Số lượng phải lớn hơn 0"
                            }
                        })}
                        className={"mt-1 p-2 border border-gray-300 rounded-md w-full"}
                    />
                    {errors.quantity && <p className={"text-red-500 text-sm"}>{errors.quantity.message}</p>}
                </div>
                <div className={"mb-4"}>
                    <label className={"block text-sm font-medium text-gray-700"}>Giá:</label>
                    <input
                        type="number"
                        {...register("price", {
                            required: "Giá không được để trống",
                            min: {
                                value: 1,
                                message: "Giá phải lớn hơn 0"
                            }
                        })}
                        className={"mt-1 p-2 border border-gray-300 rounded-md w-full"}
                    />
                    {errors.price && <p className={"text-red-500 text-sm"}>{errors.price.message}</p>}
                </div>
                <div className={"mb-4"}>
                    <label className={"block text-sm font-medium text-gray-700"}>Mô tả:</label>
                    <textarea
                        {...register("description", {required: "Mô tả không được để trống"})}
                        className={"mt-1 p-2 border border-gray-300 rounded-md w-full"}
                    />
                    {errors.description && <p className={"text-red-500 text-sm"}>{errors.description.message}</p>}
                </div>
                <div className={"mb-4"}>
                    <label className={"block text-sm font-medium text-gray-700"}>Ngày nhập:</label>
                    <input
                        type="date"
                        {...register("importDate", {required: "Ngày nhập không được để trống"})}
                        className={"mt-1 p-2 border border-gray-300 rounded-md w-full"}
                        readOnly
                    />
                    {errors.importDate && <p className={"text-red-500 text-sm"}>{errors.importDate.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Danh mục sản phẩm:</label>
                    <select
                        {...register("categoryId", {required: "Vui lòng chọn danh mục sản phẩm"})}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    >
                        <option value="">Chọn danh mục</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
                </div>
                <button type="submit"
                        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                    Thêm sản phẩm
                </button>
            </form>
        </div>
    );
}

export default ProductAdd;