/* eslint-disable react/prop-types */
import { useState } from "react";

const VoucherForm = ({ onSubmit, loadVouchers }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expired, setExpired] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("ongkir"); // Default type
  const [image, setImage] = useState(null); // Only one image
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [min, setMin] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Only one image
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("expired", expired);
    formData.append("value", value);
    formData.append("type", type);
    formData.append("min", min);
    if (image) {
      formData.append("image", image); // Append the single image
    }

    try {
      await onSubmit(formData);
      // Reset form fields
      setName("");
      setDescription("");
      setExpired("");
      setValue("");
      setType("ongkir"); // Reset to default type
      setImage(null); // Reset image
      setMin("");
      loadVouchers();
    } catch (err) {
      setError(err.message || "An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Voucher</h2>
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
        className="border border-gray-300 p-2 h-[200px] w-full mb-2 rounded"
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
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="border border-gray-300 p-2 w-full mb-4 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className={`bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Adding Voucher..." : "Add Voucher"}
      </button>
    </form>
  );
};

export default VoucherForm;