/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { deleteItem } from '../api/api';
import { convertIntegerToRupiah } from '../utils/utils';

const ItemList = ({ items, setItems, loadItems, setItemsEdit }) => {

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    const handleDelete = async (id) => {
        await deleteItem(id);
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Items</h2>
            <ul className="space-y-2">
                {items.length > 0 ? items.map(item => (
                    <li key={item.id} className="flex justify-between items-center border-b border-gray-200 py-2">
                        <span>{item.title} - {convertIntegerToRupiah(item.price)}</span>
                        <div>
                            <button onClick={() => setItemsEdit(item.id)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2">Edit</button>
                            <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                        </div>
                    </li>
                )) : (
                    <li className="text-gray-500">No items found.</li> // Display a message if no items are available
                )}
            </ul>
        </div>
    );
};

export default ItemList;