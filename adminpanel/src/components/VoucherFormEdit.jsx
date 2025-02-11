/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { fetchVouchers, updateVoucher } from "../api/api"; // Assuming you have a fetchVouchers and updateVoucher function

const VoucherFormEdit = ({ id, setVouchersEdit, fetchCategory, loadVouchers }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expired, setExpired] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("ongkir"); // Default type
  const [min, setMin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const loadVouchers = async () => {
      try {
        const data = await fetchVouchers(); // Fetch vouchers instead of items
        const voucher = data.find((voucher) => voucher.id === id);
        if (voucher) {
          setName(voucher.name);
          setDescription(voucher.description);
          setExpired(formatDateToDDMMYYYY(voucher.expired));
          setValue(voucher.value);
          setType(voucher.type);
          setMin(voucher.min);
          setSelectedCategory(voucher.category_id);
        } else {
          setError("Voucher not found.");
        }
      } catch (err) {
        setError("Failed to load vouchers: " + err.message);
      }
    };
    loadVouchers();
  }, [id, fetchCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = {
      name: name,
      description: description,
      expired: expired,
      value: value,
      type: type,
      min: min,
      category_id: selectedCategory,
    };

    try {
      await updateVoucher(id, formData); // Update voucher instead of item
      // Reset form fields
      setName("");
      setDescription("");
      setExpired("");
      setValue("");
      setType("ongkir"); // Reset to default type
      setMin("");
      setSelectedCategory(""); // Reset selected category
      loadVouchers();
    } catch (err) {
      setError(err.message || "An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit Voucher</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border border-gray-300 p-2 w-full mb-2 rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="border border-gray-300 p-2 w-full h-[200px] mb-2 rounded"
      />
      <input
        type="date"
        placeholder="Expiration Date"
        value={expired}
        onChange={(e) => setExpired(e.target.value)}
        required
        className="border border-gray-300 p-2 w-full mb-2 rounded"
      />
      <input
        type="number"
        placeholder="Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        className="border border-gray-300 p-2 w-full mb-2 rounded"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
        className="border border-gray-300 p-2 w-full mb-2 rounded"
      >
        <option value="ongkir">Ongkir</option>
 <option value="percent">Percent</option>
        <option value="rupiah">Rupiah</option>
      </select>
      <input
        type="number"
        placeholder="Minimum Value"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        required
        className="border border-gray-300 p-2 w-full mb-2 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className={`bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Editing Voucher..." : "Edit Voucher"}
      </button>

      <button
        disabled={loading}
        className={`bg-yellow-600 mx-2 text-white p-2 rounded hover:bg-blue-700 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => setVouchersEdit(0)}
      >
        Cancel
      </button>
    </form>
  );
};

export default VoucherFormEdit;