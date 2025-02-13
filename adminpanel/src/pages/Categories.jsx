import { useEffect, useState } from "react";
import CategoryForm from "../components/CategoryForm"; // Update to CategoryForm
import CategoryList from "../components/CategoryList"; // Update to CategoryList
import { createCategory, fetchCategory } from "../api/api"; // Update to fetchCategories
import CategoryFormEdit from "../components/CategoryFormEdit"; // Update to CategoryEdit
import { checkAuth } from "../utils/utils";

const Categories = () => {
  const [categories, setCategories] = useState([]); // Change items to categories
  const [categoryEditId, setCategoryEditId] = useState(0); // Change itemsEdit to categoryEditId

  const loadCategories = async () => {
    const data = await fetchCategory(); // Update to fetchCategories
    setCategories(data || []); // Ensure categories is always an array
  };

  useEffect(() => {
    if (!checkAuth()) {
      window.location.href = "/login";
    }
    loadCategories();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      // Create category logic
      const newCategory = await createCategory(formData); // Update to createCategory
      setCategories((prevCategories) => [...prevCategories, newCategory]); // Update to categories
    } catch (error) {
      console.error("Error submitting category:", error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <div className="p-4">
      {categoryEditId === 0 ? ( // Update condition to categoryEditId
        <CategoryForm
          onSubmit={handleSubmit}
          loadCategories={loadCategories} // Keep fetchCategory if needed
        />
      ) : (
        <CategoryFormEdit
          id={categoryEditId} // Update to categoryEditId
          setCategoryEditId={setCategoryEditId} // Update to setCategoryEditId
          loadCategories={loadCategories} // Keep fetchCategory if needed
        />
      )}

      <CategoryList
        categories={categories} // Update to categories
        setCategories={setCategories} // Update to setCategories
        loadCategories={loadCategories} // Update to loadCategories
        categoryEditId={categoryEditId} // Update to categoryEditId
        setCategoryEditId={setCategoryEditId} // Update to setCategoryEditId
      />
    </div>
  );
};

export default Categories; // Update export to Categories