/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { deleteVoucher } from '../api/api'; // Assuming you have a deleteVoucher function
import { convertIntegerToRupiah } from '../utils/utils'; // Assuming this utility function is still applicable

const VoucherList = ({ vouchers, setVouchers, loadVouchers, setVouchersEdit }) => {

    useEffect(() => {
        loadVouchers();
    }, [loadVouchers]);

    const handleDelete = async (id) => {
        await deleteVoucher(id); // Delete voucher instead of item
        setVouchers(prevVouchers => prevVouchers.filter(voucher => voucher.id !== id));
    };

    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Vouchers</h2>
            <ul className="space-y-2">
                {vouchers.length > 0 ? vouchers.map(voucher => (
                    <li key={voucher.id} className="flex justify-between items-center border-b border-gray-200 py-2">
                        <span>{voucher.name} - {convertIntegerToRupiah(voucher.value)}</span> {/* Assuming value is the relevant field */}
                        <div>
                            <button onClick={() => setVouchersEdit(voucher.id)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2">Edit</button>
                            <button onClick={() => handleDelete(voucher.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                        </div>
                    </li>
                )) : (
                    <li className="text-gray-500">No vouchers found.</li> // Display a message if no vouchers are available
                )}
            </ul>
        </div>
    );
};

export default VoucherList;