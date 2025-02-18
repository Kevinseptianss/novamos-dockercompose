import { useEffect, useState } from "react";
import ItemForm from "../components/ItemForm";
import ItemList from "../components/ItemList";
import { createItem, fetchCategory, fetchItems } from "../api/api";
import ItemFormEdit from "../components/ItemEdit";
import { checkAuth } from "../utils/utils";

const Items = () => {
  const [items, setItems] = useState([]);
  const [itemsEdit, setItemsEdit] = useState(0);

  async function loadItems() {
    const data = await fetchItems();
    setItems(data || []); // Ensure items is always an array
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticated = await checkAuth(); // Assuming checkAuth is an async function
      if (!isAuthenticated) {
        window.location.href = "/login";
      } else {
        loadItems(); // Proceed to load users if authenticated
      }
    };
  
    checkAuthentication();
  }, []); // Empty dependency array means this runs once on mount

  const handleSubmit = async (formData) => {
    try {
      // Create item logic
      const newItem = await createItem(formData);
      setItems((prevItems) => [...prevItems, newItem]);
    } catch (error) {
      console.error("Error submitting item:", error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <div className="p-4">
      {itemsEdit === 0 ? (
        <ItemForm
          onSubmit={handleSubmit}
          fetchCategory={fetchCategory}
          loadItems={loadItems}
        />
      ) : (
        <ItemFormEdit
          id={itemsEdit}
          setItemsEdit={setItemsEdit}
          fetchCategory={fetchCategory}
          loadItems={loadItems}
        />
      )}

      <ItemList
        items={items}
        setItems={setItems}
        loadItems={loadItems}
        itemsEdit={itemsEdit}
        setItemsEdit={setItemsEdit}
      />
    </div>
  );
};

export default Items;
