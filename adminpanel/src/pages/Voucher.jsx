import { useState, useEffect } from "react";
import VoucherForm from "../components/VoucherForm";
import VoucherList from "../components/VoucherList";
import { createVoucher, fetchVouchers } from "../api/api"; // Removed fetchCategory import
import VoucherFormEdit from "../components/VoucherFormEdit";
import { checkAuth } from "../utils/utils";

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [voucherEditId, setVoucherEditId] = useState(0); // Renamed for clarity
  async function loadVouchers() {
    try {
      const data = await fetchVouchers(); // Fetch vouchers
      setVouchers(data || []); // Ensure vouchers is always an array
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      // Optionally, you can set an error state here to display an error message
    }
  };
  
  // Load vouchers on component mount
  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticated = await checkAuth(); // Assuming checkAuth is an async function
      if (!isAuthenticated) {
        window.location.href = "/login";
      } else {
        loadVouchers(); // Proceed to load users if authenticated
      }
    };
  
    checkAuthentication();
  }, []); // Empty dependency array means this runs once on mount

  const handleSubmit = async (formData) => {
    try {
      const newVoucher = await createVoucher(formData); // Create a voucher
      setVouchers((prevVouchers) => [...prevVouchers, newVoucher]);
    } catch (error) {
      console.error("Error submitting voucher:", error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <div className="p-4">
      {voucherEditId === 0 ? ( // Check if we are editing a voucher
        <VoucherForm
          onSubmit={handleSubmit}
          loadVouchers={loadVouchers} // Update to loadVouchers
        />
      ) : (
        <VoucherFormEdit
          id={voucherEditId}
          setVouchersEdit={setVoucherEditId} // Update to setVouchersEdit
          loadVouchers={loadVouchers} // Update to loadVouchers
        />
      )}

      <VoucherList
        vouchers={vouchers} // Update to vouchers
        setVouchers={setVouchers} // Update to setVouchers
        loadVouchers={loadVouchers} // Update to loadVouchers
        vouchersEdit={voucherEditId} // Update to vouchersEdit
        setVouchersEdit={setVoucherEditId} // Update to setVouchersEdit
      />
    </div>
  );
};

export default Vouchers;