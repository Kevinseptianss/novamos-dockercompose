function convertRupiahToInteger(rupiahString) {
  if (!rupiahString) return 0;
  const cleanedString = rupiahString.replace(/Rp\s*|\.|/g, "");
  const integerValue = parseInt(cleanedString, 10);

  if (isNaN(integerValue)) {
    return 0;
  }

  return integerValue;
}

function convertIntegerToRupiah(amount) {
  try {
    let rupiah = amount.toString();
    let parts = rupiah.split(".");
    let integerPart = parts[0];
    let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    let decimalPart = parts.length > 1 ? "," + parts[1] : "";

    return "Rp " + formattedInteger + decimalPart;
  } catch (error) {
    console.log(error);
  }
}

export { convertIntegerToRupiah, convertRupiahToInteger };
