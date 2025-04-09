export const validateCardNumber = (number) => {
  const regex = /^[0-9]{16}$/;
  return regex.test(number.replace(/\s/g, ""));
};

export const validateExpiryDate = (date) => {
  const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!regex.test(date)) return false;

  const [month, year] = date.split("/");
  const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
  const today = new Date();
  return expiry > today;
};

export const validateCVV = (cvv) => {
  const regex = /^[0-9]{3,4}$/;
  return regex.test(cvv);
};

export const validateZipCode = (zipCode) => {
  const regex = /^[0-9]{5}(-[0-9]{4})?$/;
  return regex.test(zipCode);
};

export const validatePhone = (phone) => {
  const regex = /^\+?[1-9]\d{1,14}$/;
  return regex.test(phone.replace(/\D/g, ""));
};

export const formatCardNumber = (number) => {
  const cleaned = number.replace(/\D/g, "");
  const match = cleaned.match(/(\d{4})(\d{4})?(\d{4})?(\d{4})?/);
  if (!match) return cleaned;
  
  const parts = [match[1]];
  if (match[2]) parts.push(match[2]);
  if (match[3]) parts.push(match[3]);
  if (match[4]) parts.push(match[4]);
  
  return parts.join(" ");
};

export const formatExpiryDate = (input) => {
  const cleaned = input.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{2})?/);
  if (!match) return cleaned;
  
  const month = match[1];
  const year = match[2] || "";
  
  if (year) {
    return `${month}/${year}`;
  }
  return month;
}; 