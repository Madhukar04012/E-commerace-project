import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Generates a PDF invoice for an order
 * @param {Object} order - The order object containing all order details
 * @returns {jsPDF} - The PDF document
 */
export const generateInvoice = (order) => {
  const doc = new jsPDF();
  
  // Add company logo/header
  doc.setFontSize(22);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text('StyleShop', 14, 20);
  
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('Invoice', 14, 30);
  
  doc.setFontSize(12);
  doc.text(`Order #${order.id}`, 14, 40);
  doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 14, 46);
  
  // Customer details
  doc.text('Bill To:', 14, 60);
  doc.text(`${order.customer.name}`, 14, 66);
  doc.text(`${order.shipping.address.street}`, 14, 72);
  doc.text(`${order.shipping.address.city}, ${order.shipping.address.state} ${order.shipping.address.zip}`, 14, 78);
  
  // Create table for items
  const tableColumn = ["Item", "Qty", "Price", "Total"];
  const tableRows = [];
  
  order.items.forEach(item => {
    const itemData = [
      item.name,
      item.quantity,
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`
    ];
    tableRows.push(itemData);
  });
  
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 90,
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 244, 255]
    }
  });
  
  // Total calculations at the bottom
  const finalY = doc.previousAutoTable.finalY + 10;
  
  // Add payment information section
  doc.text('Payment Information:', 14, finalY + 5);
  doc.text(`Payment Method: ${order.payment?.cardBrand || 'Credit Card'}`, 14, finalY + 12);
  doc.text(`Last 4 Digits: ${order.payment?.cardLast4 || 'xxxx'}`, 14, finalY + 19);
  
  // Add totals on right side
  doc.text(`Subtotal: $${order.subtotal.toFixed(2)}`, 140, finalY + 5);
  doc.text(`Shipping: $${order.shipping.toFixed(2)}`, 140, finalY + 12);
  doc.text(`Tax: $${order.tax.toFixed(2)}`, 140, finalY + 19);
  
  // Total with bold formatting
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`Total: $${order.total.toFixed(2)}`, 140, finalY + 30);
  
  // Add footer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'normal');
  doc.text('Thank you for shopping with StyleShop!', 14, doc.internal.pageSize.height - 30);
  doc.text('For any questions regarding your order, please contact our customer service.', 14, doc.internal.pageSize.height - 25);
  doc.text(`© ${new Date().getFullYear()} StyleShop. All rights reserved.`, 14, doc.internal.pageSize.height - 15);
  
  return doc;
};

/**
 * Generates and downloads a PDF invoice for an order
 * @param {Object} order - The order object
 */
export const downloadInvoice = (order) => {
  const doc = generateInvoice(order);
  doc.save(`invoice-${order.id}.pdf`);
}; 