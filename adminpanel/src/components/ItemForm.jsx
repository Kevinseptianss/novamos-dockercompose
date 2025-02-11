/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const ItemForm = ({ onSubmit, fetchCategory, loadItems }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategory();
        setCategories(data);
      } catch (err) {
        setError("Failed to load categories." + err);
      }
    };

    loadCategories();
  }, [fetchCategory]);
  

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category_id", selectedCategory);
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
          }
      await onSubmit(formData);
      // Reset form fields
      setTitle("");
      setDescription("");
      setPrice("");
      setImages([]);
      setSelectedCategory(""); // Reset selected category
      loadItems();
    } catch (err) {
      setError(err.message || "An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="border border-gray-300 p-2 w-full mb-2 rounded"
      />
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        required
        className="border border-gray-300 p-2 w-full mb-2 rounded"
      >
        <option value="" disabled>Select Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        type="file"
        accept="image/*"
        multiple
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
        {loading ? "Adding Item..." : "Add Item"}
      </button>
    </form>
  );
};

export default ItemForm;