/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { deleteAdmins, getAdmins, updateAdmins, createAdmin } from "../api/api";
import { checkAuth } from "../utils/utils";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    password: "",
    question: "",
    answer: "",
  });

  async function loadUsers() {
    try {
      const data = await getAdmins();
      setAdmins(data || []); // Ensure admins is always an array
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteAdmins(id);
      loadUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateAdmins(selectedUser.id, {
        username: selectedUser.username,
        password: selectedUser.password,
      });
      setIsEditModalOpen(false);
      loadUsers(); // Refresh the list after update
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      await createAdmin(newAdmin);
      setIsAddModalOpen(false);
      setNewAdmin({ username: "", password: "", question: "", answer: "" });
      loadUsers(); // Refresh the list after adding a new admin
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticated = await checkAuth(); // Assuming checkAuth is an async function
      if (!isAuthenticated) {
        window.location.href = "/login";
      } else {
        loadUsers(); // Proceed to load users if authenticated
      }
    };

    checkAuthentication();
  }, []); // Empty dependency array means this runs once on mount

  const TableRow = ({ user, onDelete, onEdit }) => {
    return (
      <tr key={user.id}>
        <td className="border border-gray-300 p-2">{user.id}</td>
        <td className="border border-gray-300 p-2">{user.username}</td>
        <td className="border border-gray-300 p-2">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
            onClick={() => onEdit(user)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => onDelete(user.id)}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Admins</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Admin
        </button>
      </div>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Username</th>
            <th className="border border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {admins
            .slice()
            .reverse()
            .map((user, index) => (
              <TableRow
                key={index}
                user={user}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
        </tbody>
      </table>

      {/* Edit Admin Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Edit Admin</h2>
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      username: e.target.value,
                    })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={selectedUser.password}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      password: e.target.value,
                    })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg w-[300px] bg-opacity-20">
            <h2 className="text-xl font-bold mb-4">Add Admin</h2>
            <form onSubmit={handleAddAdmin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={newAdmin.username}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, username: e.target.value })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, password: e.target.value })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Security Question
                </label>
                <input
                  type="text"
                  value={newAdmin.question}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, question: e.target.value })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Answer
                </label>
                <input
                  type="text"
                  value={newAdmin.answer}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, answer: e.target.value })
                  }
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admins;
