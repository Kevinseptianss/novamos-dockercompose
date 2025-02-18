/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { fetchOrders, updateOrderAWB, updateOrderStatus } from "../api/api";
import { checkAuth } from "../utils/utils";

const Modal = ({ isOpen, onClose, imageSrc }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded">
        <button onClick={onClose} className="absolute top-2 right-2 text-white">
          Close
        </button>
        <img
          src={imageSrc}
          alt="Full Size"
          className="max-w-full max-h-screen"
        />
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // State for filtered orders
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filter, setFilter] = useState(""); // State for filter
  const [payment, setPayment] = useState("");
  const [modal, setModal] = useState({ isOpen: false, imageSrc: "" });

  const openModal = (imageSrc) => {
    setModal({ isOpen: true, imageSrc });
  };

  const closeModal = () => {
    setModal({ isOpen: false, imageSrc: "" });
  };

  async function loadOrders() {
    try {
      const data = await fetchOrders();
      setOrders(data || []); // Ensure orders is always an array
      setFilteredOrders(data || []); // Initialize filteredOrders with the fetched data
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticated = await checkAuth(); // Assuming checkAuth is an async function
      if (!isAuthenticated) {
        window.location.href = "/login";
      } else {
        loadOrders(); // Proceed to load users if authenticated
      }
    };
  
    checkAuthentication();
  }, []); // Empty dependency array means this runs once on mount

  const handleSearch = (term) => {
    setSearchTerm(term);
    applyFilters(term, filter, payment);
  };

  const handleFilter = (selectedFilter) => {
    setFilter(selectedFilter);
    applyFilters(searchTerm, selectedFilter, payment);
  };

  const handlePayment = (pay) => {
    setPayment(pay);
    applyFilters(searchTerm, filter, pay);
  }

  // Apply both search and filter to orders
  const applyFilters = (searchTerm, filter, pay) => {
    let filtered = orders;

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter((order) => {
        const user = order.user ? JSON.parse(order.user) : {};
        const address = JSON.parse(order.address);
        const courier = JSON.parse(order.courier);
        const payment = JSON.parse(order.payment);

        return (
          order.id.toString().includes(searchTerm) ||
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          address.phone?.includes(searchTerm) ||
          courier.awb?.includes(searchTerm)||
          payment.payment?.includes(searchTerm)
        );
      });
    }

    // Apply status filter
    if (filter) {
      filtered = filtered.filter((order) => {
        const status = JSON.parse(order.status);
        return status.some((option) => {
          if (filter === "new" && option.title === "Pesanan Diterima") {
            return option.status;
          } else if (
            filter === "progress" &&
            option.title === "Pesanan Dikonfirmasi"
          ) {
            return option.status;
          } else if (
            filter === "delivery" &&
            option.title === "Pengiriman"
          ) {
            return option.status;
          } else if (
            filter === "deliverd" &&
            option.title === "Sampai Tujuan"
          ) {
            return option.status;
          }
          return false;
        });
      });
    }

    if (pay) {
      filtered = filtered.filter((order) => {
        const payment = JSON.parse(order.payment);

        return (
          payment.payment?.includes(pay)
        );
      });
    }

    setFilteredOrders(filtered);
  };

  const updateOrder = async (id, awbInput) => {
    await updateOrderAWB(id, awbInput);
    loadOrders();
  };

  const TableRow = ({ order }) => {
    const [awbInput, setAwbInput] = useState("");
    const [statusOptions, setStatusOptions] = useState([]);

    useEffect(() => {
      try {
        const courier = JSON.parse(order.courier);
        const status = JSON.parse(order.status);
        setAwbInput(courier.awb);
        setStatusOptions(status);
      } catch (err) {
        console.log(err);
      }
    }, [order.courier, order.status]);

    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        const updatedCourier = { ...JSON.parse(order.courier), awb: awbInput };
        updateOrder(order.id, updatedCourier);
        setAwbInput(""); // Clear input after submission
      }
    };

    const handleStatusChange = async (title) => {
      const today = new Date();
      const formattedDate = formatDateToIndonesian(today);
      const updatedStatusOptions = statusOptions.map((option) => {
        if (option.title === title) {
          return {
            ...option,
            status: !option.status, // Toggle the status
            date: formattedDate, // Add the formatted date property
          };
        }
        return option;
      });

      setStatusOptions(updatedStatusOptions);
      await updateOrderStatus(order.id, updatedStatusOptions);
    };

    try {
      const user = order.user ? JSON.parse(order.user) : "";
      const items = JSON.parse(order.items);
      const voucher = order.voucher ? JSON.parse(order.voucher) : "";
      const payment = JSON.parse(order.payment);
      const address = JSON.parse(order.address);
      const courier = JSON.parse(order.courier);

      return (
        <tr key={order.id}>
          <td className="border border-gray-300 p-2">{order.id}</td>
          <td className="border border-gray-300 p-2">{user.name}</td>
          <td className="border border-gray-300 p-2">
            {formatISODateString(order.order_date)}
          </td>
          <td className="border border-gray-300 p-2">
            {items.map((item, itemIndex) => (
              <p key={itemIndex}>
                {item.title} x {item.qty}
              </p>
            ))}
          </td>
          <td className="border border-gray-300 p-2">{voucher.name}</td>
          <td className="border border-gray-300 p-2">
            Tipe Pembayaran: <b>{payment.payment}</b> <br />
            {payment.image && (
              <img
                src={`http://103.146.202.98:3000/orders/upload/${payment.image}`}
                style={{ height: 100, width: 100, cursor: "pointer" }}
                onClick={() =>
                  openModal(
                    `http://103.146.202.98:3000/orders/upload/${payment.image}`
                  )
                }
                alt="Payment"
              />
            )}
          </td>
          <td className="border border-gray-300 p-2">
            Nama Penerima: <b>{address.name}</b> <br /> Handphone:{" "}
            <b>{address.phone}</b> <br /> Alamat:{" "}
            <b>
              {`${address.address}, ${address.subdistrict}, ${address.district}, ${address.city}, ${address.province}, ${address.zip}`}
            </b>
          </td>
          <td className="border border-gray-300 p-2">
            Nama Kurir: {courier.name} <br />
            Servis: {courier.service} <br /> Ongkos: {courier.price} <br />
            <input
              type="text"
              value={awbInput}
              onChange={(e) => setAwbInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter AWB"
              className="border border-gray-300 p-1"
            />
          </td>
          <td className="border border-gray-300 p-2">
            {statusOptions.map((option, index) => (
              <div key={index}>
                <label>
                  <input
                    type="checkbox"
                    checked={option.status}
                    onChange={() => handleStatusChange(option.title)}
                  />
                  {option.title}
                </label>
              </div>
            ))}
          </td>
        </tr>
      );
    } catch (err) {
      console.log(err);
      return null; // Return null or some fallback UI in case of an error
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Orders</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Cari ID Order, Nama Customer, Phone, Resi ..."
            className="border border-gray-300 p-2 rounded w-96"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <select
            className="border border-gray-300 p-2 rounded"
            onChange={(e) => handlePayment(e.target.value)}
          >
            <option value="">Semua Pembayaran</option>
            <option value="transfer">Transfer</option>
            <option value="cod">COD</option>
          </select>
          <select
            className="border border-gray-300 p-2 rounded"
            onChange={(e) => handleFilter(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="new">Pesanan Baru</option>
            <option value="progress">Pesanan Diproses</option>
            <option value="delivery">Pesanan Dalam Pengiriman</option>
            <option value="deliverd">Pesanan Sampai Tujuan</option>
          </select>
        </div>
      </div>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID Order</th>
            <th className="border border-gray-300 p-2">User</th>
            <th className="border border-gray-300 p-2">Order Date</th>
            <th className="border border-gray-300 p-2">Items</th>
            <th className="border border-gray-300 p-2">Voucher</th>
            <th className="border border-gray-300 p-2">Payment</th>
            <th className="border border-gray-300 p-2">Address</th>
            <th className="border border-gray-300 p-2">Courier</th>
            <th className="border border-gray-300 p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders
            .slice()
            .reverse()
            .map((order, index) => (
              <TableRow key={order.id} order={order} index={index} />
            ))}
        </tbody>
      </table>
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        imageSrc={modal.imageSrc}
      />
    </div>
  );
};

function formatISODateString(isoDateString) {
  const date = new Date(isoDateString);
  return formatDateToIndonesian(date);
}

function formatDateToIndonesian(date) {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export default Orders;
