/* eslint-disable react/prop-types */
import { useState } from "react";

const CategoryForm = ({ onSubmit, loadCategories }) => {
  const [name, setName] = useState(""); // Change title to name
  const [image, setImage] = useState(null); // Change images to a single image
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Only take the first file
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", name); // Append name
    if (image) {
      formData.append("image", image); // Append single image
    }

    try {
      await onSubmit(formData);
      // Reset form fields
      setName("");
      setImage(null); // Reset image
      loadCategories(); // Load categories after submission
    } catch (err) {
      setError(err.message || "An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="text"
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        {loading ? "Adding Category..." : "Add Category"}
      </button>
    </form>
  );
};

export default CategoryForm;