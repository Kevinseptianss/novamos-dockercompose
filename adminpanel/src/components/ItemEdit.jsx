/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { fetchItems, updateItem } from "../api/api";

const ItemFormEdit = ({ id, setItemsEdit, fetchCategory, loadItems }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategory();
        setCategories(data);
      } catch (err) {
        setError("Failed to load categories: " + err.message);
      }
    };
  
    const loadItems = async () => {
      try {
        const data = await fetchItems();
        const dataId = data.find((dataa) => dataa.id === id);
        if (dataId) {
          setTitle(dataId.title);
          setDescription(dataId.description);
          setPrice(dataId.price);
          setSelectedCategory(dataId.category_id);
          setWeight(dataId.weight);
        } else {
          setError("Item not found.");
        }
      } catch (err) {
        setError("Failed to load items: " + err.message);
      }
    };
  
    loadCategories();
    loadItems();
  }, [id, fetchCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = {
      title: title,
      description: description,
      price: price,
      category_id: selectedCategory,
      weight: weight,
    }

    try {
      await updateItem(id, formData);
      // Reset form fields
      setTitle("");
      setDescription("");
      setPrice("");
      setSelectedCategory(""); // Reset selected category
      setWeight("");
      loadItems();
    } catch (err) {
      setError(err.message || "An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit Item</h2>
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
        className="border border-gray-300 p-2 w-full h-[200px] mb-2 rounded"
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="border border-gray-300 p-2 w-full mb-2 rounded"
      />
      <input
        type="number"
        placeholder="Weight (in Grams ex: 1000 it's 1000g)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
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
      <button
        type="submit"
        disabled={loading}
        className={`bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Editing Item..." : "Edit Item"}
      </button>

      <button
        disabled={loading}
        className={`bg-yellow-600 mx-2 text-white p-2 rounded hover:bg-blue-700 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => setItemsEdit(0)}
      >
        Cancel
      </button>
    </form>
  );
};

export default ItemFormEdit;