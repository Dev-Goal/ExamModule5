import React, {useEffect, useState} from 'react';
import {deleteProduct, fetchProducts} from "../../service/productService.jsx";
import {Link} from "react-router-dom";
import {fetchCategories} from "../../service/categoryService.jsx";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {toast} from "react-toastify";
import Modal from 'react-modal';

function ProductList() {
    let [products, setProducts] = useState([]);
    let [categories, setCategories] = useState([]);
    let [searchName, setSeachName] = useState("");
    let [selectedCategory, setSelectedCategory] = useState("");
    let [modalIsOpen, setModalIsOpen] = useState(false);
    let [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, [])

    useEffect(() => {
        loadProducts();
    }, [searchName, selectedCategory]);

    let loadProducts = async () => {
        try {
            let data = await fetchProducts(searchName, selectedCategory);
            setProducts(data);
        } catch (error) {
            toast.error("Không thể tải danh sách sản phẩm");
        }
    }

    let openDeleteModal = (product) => {
        setProductToDelete(product);
        setModalIsOpen(true);
    };

    let closeDeleteModal = () => {
        setProductToDelete(null);
        setModalIsOpen(false);
    };

    let loadCategories = async () => {
        try {
            let data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            toast.error("Không thể tải danh sách danh mục");
        }
    }

    let handleDelete = async () => {
        try {
            await deleteProduct(productToDelete.id);
            toast.success("Xóa sản phẩm thành công");
            loadProducts();
            closeDeleteModal();
        } catch (error) {
            toast.error("Lỗi khi xóa sản phẩm");
        }
    };

    return (
        <div className={"container mx-auto p-4"}>
            <Link to="/product/add-product"
                  className="inline-block mb-4 px-2 py-2 mr-2 bg-green-500 text-white rounded hover:bg-green-600">
                Thêm sản phẩm mới
            </Link>
            <Link to="/category/categories"
                  className="inline-block mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Danh sách danh mục
            </Link>
            <h1 className={"text-2xl font-bold mb-6 text-center"}>Danh sách sản phẩm</h1>
            <div className={"flex mb-4"}>
                <input type={"text"}
                       placeholder={"Nhập tên sản phẩm"}
                       value={searchName}
                       onChange={(e) => setSeachName(e.target.value)}
                       className={"p-2 border border-gray-300 rounded-md mr-2"}/>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md mr-2"
                >
                    <option value="">Tất cả danh mục</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto">
                {products.length === 0 ? (
                    <p className="text-center text-red-500 font-bold">Sản phẩm này không có</p>
                ) : (
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-center">STT</th>
                            <th className="py-3 px-6 text-left">Mã sản phẩm</th>
                            <th className="py-3 px-6 text-left">Tên sản phẩm</th>
                            <th className="py-3 px-6 text-left">Danh mục</th>
                            <th className="py-3 px-6 text-left">Số lượng</th>
                            <th className="py-3 px-6 text-left">Giá</th>
                            <th className="py-3 px-6 text-left">Mô tả</th>
                            <th className="py-3 px-6 text-left">Ngày nhập</th>
                            <th className="py-3 px-6 text-center">Hành động</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-light">
                        {products.map((product, index) => (
                            <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-center">{index + 1}</td>
                                <td className="py-3 px-6 text-left">{product.productCode}</td>
                                <td className="py-3 px-6 text-left">{product.name}</td>
                                <td className="py-3 px-6 text-left">
                                    {categories.find(category => category.id === product.categoryId)?.name || "Không xác định"}
                                </td>
                                <td className="py-3 px-6 text-left">{product.quantity}</td>
                                <td className="py-3 px-6 text-left">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(product.price)}
                                </td>
                                <td className="py-3 px-6 text-left">{product.description}</td>
                                <td className="py-3 px-6 text-left">
                                    {new Date(product.importDate).toLocaleDateString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </td>
                                <td className="py-3 px-6 text-center flex justify-center space-x-4">
                                    <Link to={`/product/edit-product/${product.id}`}
                                          className="text-yellow-500">
                                        <FontAwesomeIcon icon={faPen}/>
                                    </Link>
                                    <button onClick={() => openDeleteModal(product)}
                                            style={{border: 'none', background: 'none', cursor: 'pointer'}}>
                                        <FontAwesomeIcon icon={faTrash} color="red"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>)}
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeDeleteModal}
                className="bg-white p-6 rounded shadow-md max-w-sm mx-auto mt-20"
                overlayClassName="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
            >
                <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
                <p>Bạn có chắc chắn muốn xóa sản phẩm "{productToDelete?.name}" không?</p>
                <div className="mt-6 flex justify-end">
                    <button onClick={closeDeleteModal} className="px-4 py-2 mr-2 bg-gray-300 rounded">Hủy</button>
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">Xóa</button>
                </div>
            </Modal>
        </div>
    );
}

export default ProductList;