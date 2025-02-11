/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { deleteCategory } from '../api/api'; // Update to deleteCategory

const CategoryList = ({ categories, setCategories, loadCategories, setCategoryEditId }) => { // Update props to categories and setCategoryEditId

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const handleDelete = async (id) => {
        await deleteCategory(id); // Update to deleteCategory
        setCategories(prevCategories => prevCategories.filter(category => category.id !== id)); // Update to categories
    };

    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <ul className="space-y-2">
                {categories.length > 0 ? categories.map(category => ( // Update to categories
                    <li key={category.id} className="flex justify-between items-center border-b border-gray-200 py-2">
                        <span>{category.name}</span> {/* Display category name */}
                        <div>
                            <button onClick={() => setCategoryEditId(category.id)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2">Edit</button>
                            <button onClick={() => handleDelete(category.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                        </div>
                    </li>
                )) : (
                    <li className="text-gray-500">No categories found.</li> // Display a message if no categories are available
                )}
            </ul>
        </div>
    );
};

export default CategoryList;