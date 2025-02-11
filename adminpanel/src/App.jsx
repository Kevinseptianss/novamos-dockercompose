import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import Categories from './pages/Categories';
import Vouchers from './pages/Voucher';
import Articles from './pages/Article';
import Orders from './pages/Orders';

const App = () => {
    return (
        <Router>
            <div className="flex">
                <Sidebar />
                <div className="flex-1">
                    <Header />
                    <div className="p-4">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/items" element={<Items />} />
                            <Route path="/categories" element={<Categories />} />
                            <Route path="/vouchers" element={<Vouchers />} />
                            <Route path="/article" element={<Articles />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;