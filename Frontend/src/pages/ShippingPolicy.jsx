import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="page-container" style={{maxWidth: '900px', margin: '40px auto', padding: '0 16px'}}>
      <h1 style={{marginBottom: 8}}>Shipping Policy</h1>
      <p>
        Thank you for shopping with R.S Collextion. We are committed to delivering your orders quickly, safely, and efficiently across India. Please review our shipping policy below:
      </p>

      <h3>1. Shipping Partner</h3>
      <p>All orders are shipped through our trusted logistics partner Shiprocket, ensuring timely and reliable delivery to your doorstep.</p>

      <h3>2. Delivery Timeline</h3>
      <ul>
        <li>Standard Delivery Time: 3 to 6 business days</li>
        <li>Delivery times may vary based on your location, product availability, or during high-demand periods.</li>
        <li>Orders placed on weekends or public holidays will be processed on the next working day.</li>
      </ul>

      <h3>3. Shipping Charges</h3>
      <ul>
        <li>A flat shipping fee of ₹150 will be applied to all orders at checkout.</li>
        <li>Any promotional free shipping offers will be mentioned during the checkout process.</li>
      </ul>

      <h3>4. Order Processing</h3>
      <p>Once your order is placed and confirmed, we begin processing immediately. Orders cannot be canceled, modified, or exchanged once confirmed.</p>

      <h3>5. Delivery Areas</h3>
      <ul>
        <li>We currently ship across all states in India.</li>
        <li>For remote or restricted areas, additional delivery time may be required.</li>
      </ul>

      <h3>6. Tracking Information</h3>
      <p>
        Once your order is dispatched, a tracking link will be sent via email or SMS. You can track your shipment in real-time through the Shiprocket platform.
      </p>

      <h3>7. Delivery Delays</h3>
      <p>
        While we strive to meet our standard delivery timeline, delays may occur due to natural calamities, weather conditions, strikes, or operational/courier-related issues. We appreciate your understanding and patience in such cases.
      </p>

      <h3>8. Delivery Issues</h3>
      <p>
        If your order is marked as delivered but hasn’t been received, or if the parcel is damaged, please contact us within 48 hours at:
      </p>
      <p>
        Email: <a href="mailto:rscollextion@gmail.com">rscollextion@gmail.com</a><br/>
        Phone: <a href="tel:+916304522676">+91 6304522676</a>
      </p>
    </div>
  );
};

export default ShippingPolicy;
