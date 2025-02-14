import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <nav className="bg-gray-800 text-white w-64 h-screen p-4">
            <ul className="space-y-2">
                <li><Link to="/" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link></li>
                <li><Link to="/orders" className="block p-2 hover:bg-gray-700 rounded">Orders</Link></li>
                <li><Link to="/items" className="block p-2 hover:bg-gray-700 rounded">Items</Link></li>
                <li><Link to="/categories" className="block p-2 hover:bg-gray-700 rounded">Categories</Link></li>
                <li><Link to="/users" className="block p-2 hover:bg-gray-700 rounded">Users</Link></li>
                <li><Link to="/vouchers" className="block p-2 hover:bg-gray-700 rounded">Vouchers</Link></li>
                <li><Link to="/article" className="block p-2 hover:bg-gray-700 rounded">Article</Link></li>
            </ul>
        </nav>
    );
};

export default Sidebar;