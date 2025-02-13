
const Header = () => {

    const handleLogout = () => {
        // Remove the password key from local storage
        localStorage.removeItem('pass');
        window.location.href = '/';
    };

    return (
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <button 
                onClick={handleLogout} 
                className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
            >
                Logout
            </button>
        </header>
    );
};

export default Header;