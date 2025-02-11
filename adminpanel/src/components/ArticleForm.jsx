/* eslint-disable react/prop-types */
import { useState } from "react";

const ArticleForm = ({ onSubmit, loadArticles }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

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
    formData.append("category", categories);
    if (image) {
      formData.append("image", image); // Append the single image
    }

    try {
      await onSubmit(formData);
      // Reset form fields
      setTitle("");
      setBody("");
      setDate("");
      setImage(null);
      loadArticles(); // Load articles after submission
    } catch (err) {
      setError(err.message || "An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Article</h2>
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
        className="border border-gray-300 p-2 h-[200px] w-full mb-2 rounded"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="border border-gray-300 p-2 w-full mb-2 rounded"
      />
      <input
        type="text"
        value={categories}
        onChange={(e) => setCategories(e.target.value)}
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
        {loading ? "Adding Article..." : "Add Article"}
      </button>
    </form>
  );
};

export default ArticleForm;