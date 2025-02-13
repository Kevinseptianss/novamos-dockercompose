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
  const [modal, setModal] = useState({ isOpen: false, imageSrc: "" });

  const openModal = (imageSrc) => {
    setModal({ isOpen: true, imageSrc });
  };

  const closeModal = () => {
    setModal({ isOpen: false, imageSrc: "" });
  };

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data || []); // Ensure orders is always an array
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Optionally, you can set an error state here to display an error message
    }
  };

  useEffect(() => {
    if (!checkAuth()) {
      window.location.href = "/login";
    }
    loadOrders();
  }, []); // Load orders when the component mounts

  const updateOrder = async (id, awbInput) => {
    await updateOrderAWB(id, awbInput);
    loadOrders();
  };

  const TableRow = ({ order, index }) => {
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
          <td className="border border-gray-300 p-2">{index + 1}</td>
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
      <h1 className="text-xl font-bold mb-4">Orders</h1>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">No</th>
            <th className="border border-gray-300 p-2">User </th>
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
          {orders
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
