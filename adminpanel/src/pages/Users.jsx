/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { getUsers } from "../api/api";
import { checkAuth } from "../utils/utils";

const Users = () => {
  const [users, setUsers] = useState([]);

  async function loadUsers() {
    try {
      const data = await getUsers();
      console.log(data);
      setUsers(data || []); // Ensure orders is always an array
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Optionally, you can set an error state here to display an error message
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


  const TableRow = ({ user }) => {

      return (
        <tr key={user.id}>
          <td className="border border-gray-300 p-2">{user.id}</td>
          <td className="border border-gray-300 p-2">{user.name}</td>
          <td className="border border-gray-300 p-2">{user.email}</td>
          <td className="border border-gray-300 p-2">{user.phone}</td>
        </tr>
      );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Users</h1>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Name </th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Phone</th>
          </tr>
        </thead>
        <tbody>
          {users
            .slice()
            .reverse()
            .map((user, index) => (
              <TableRow key={index} user={user} />
            ))}
        </tbody>
      </table>
    </div>
  );
};



export default Users;
