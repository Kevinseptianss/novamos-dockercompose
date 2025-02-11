/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { fetchCategory, updateCategory } from "../api/api"; // Update to fetchCategories and updateCategory

const CategoryFormEdit = ({ id, setCategoryEditId, loadCategories }) => {
  const [name, setName] = useState(""); // Change title to name
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const data = await fetchCategory(); // Fetch all categories
        const category = data.find((cat) => cat.id === id); // Find the category by id
        if (category) {
          setName(category.name); // Set the name from the fetched category
        } else {
          setError("Category not found.");
        }
      } catch (err) {
        setError("Failed to load categories: " + err.message);
      }
    };

    loadCategory();
  }, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = { 
        name: name,
    }
    
    try {
      await updateCategory(id, formData); // Update category
      // Reset form fields
      setName("");
      loadCategories(); // Reload categories after submission
    } catch (err) {
      setError(err.message || "An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="text"
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        {loading ? "Editing Category..." : "Edit Category"}
      </button>

      <button
        disabled={loading}
        className={`bg-yellow-600 mx-2 text-white p-2 rounded hover:bg-blue-700 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => setCategoryEditId(0)} // Update to setCategoryEditId
      >
        Cancel
      </button>
    </form>
  );
};

export default CategoryFormEdit;