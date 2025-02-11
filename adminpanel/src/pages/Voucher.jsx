import { useState } from "react";
import VoucherForm from "../components/VoucherForm"; // Assuming you have a VoucherForm component
import VoucherList from "../components/VoucherList"; // Assuming you have a VoucherList component
import { createVoucher, fetchCategory, fetchVouchers } from "../api/api"; // Assuming you have a createVoucher and fetchVouchers function
import VoucherFormEdit from "../components/VoucherFormEdit"; // Assuming you have a VoucherEdit component

const Vouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [vouchersEdit, setVouchersEdit] = useState(0);

  const loadVouchers = async () => {
    const data = await fetchVouchers(); // Fetch vouchers instead of items
    setVouchers(data || []); // Ensure vouchers is always an array
  };

  const handleSubmit = async (formData) => {
    try {
      // Create voucher logic
      const newVoucher = await createVoucher(formData); // Create a voucher instead of an item
      setVouchers((prevVouchers) => [...prevVouchers, newVoucher]);
    } catch (error) {
      console.error("Error submitting voucher:", error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <div className="p-4">
      {vouchersEdit === 0 ? (
        <VoucherForm
          onSubmit={handleSubmit}
          fetchCategory={fetchCategory}
          loadVouchers={loadVouchers} // Update to loadVouchers
        />
      ) : (
        <VoucherFormEdit
          id={vouchersEdit}
          setVouchersEdit={setVouchersEdit} // Update to setVouchersEdit
          fetchCategory={fetchCategory}
          loadVouchers={loadVouchers} // Update to loadVouchers
        />
      )}

      <VoucherList
        vouchers={vouchers} // Update to vouchers
        setVouchers={setVouchers} // Update to setVouchers
        loadVouchers={loadVouchers} // Update to loadVouchers
        vouchersEdit={vouchersEdit} // Update to vouchersEdit
        setVouchersEdit={setVouchersEdit} // Update to setVouchersEdit
      />
    </div>
  );
};

export default Vouchers;