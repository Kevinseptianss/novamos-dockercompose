/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { fetchItems, updateItem } from "../api/api"; // Assuming updateItem is the function to update an article

const ArticleFormEdit = ({ id, setArticlesEdit, fetchCategory, loadArticles }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState(null); // For the single image

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategory();
        setCategories(data);
      } catch (err) {
        setError("Failed to load categories: " + err.message);
      }
    };

    const loadArticles = async () => {
      try {
        const data = await fetchItems(); // Assuming fetchItems fetches articles
        const article = data.find((article) => article.id === id);
        if (article) {
          setTitle(article.title);
          setBody(article.body);
          setDate(article.date);
          setSelectedCategory(article.category_id);
        } else {
          setError("Article not found.");
        }
      } catch (err) {
        setError("Failed to load articles: " + err.message);
      }
    };

    loadCategories();
    loadArticles();
  }, [id, fetchCategory]);

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Only allow one image
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("date", date);
    formData.append("category_id", selectedCategory);
    if (image) {
      formData.append("image", image); // Append the single image
    }

    try {
      await updateItem(id, formData); // Assuming updateItem is the function to update an article
      // Reset form fields
      setTitle("");
      setBody("");
      setDate("");
      setSelectedCategory(""); // Reset selected category
      setImage(null); // Reset image
      loadArticles(); // Load articles after submission
    } catch (err) {
      setError(err.message || "An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit Article</h2>
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
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        className="border border-gray-300 p-2 w-full h-[200px] mb-2 rounded"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
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
        {loading ? "Editing Article..." : "Edit Article"}
      </button>

      <button
        disabled={loading}
        className={`bg-yellow-600 mx-2 text-white p-2 rounded hover:bg-blue-700 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => setArticlesEdit(0)}
      >
        Cancel
      </button>
    </form>
  );
};

export default ArticleFormEdit;