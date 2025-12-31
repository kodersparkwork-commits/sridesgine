import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="page-container" style={{maxWidth: '900px', margin: '40px auto', padding: '0 16px'}}>
      <h1 style={{marginBottom: 8}}>Refund Policy</h1>
      <h2 style={{marginTop: 0, fontSize: 18, opacity: 0.8}}>Refund & Exchange Policy</h2>
      <p>
        At R.S Collextion, we take pride in offering high-quality boutique and handcrafted fashion items. As each piece is carefully curated and made with attention to detail, we follow a strict no return, no exchange, and no cancellation policy.
      </p>

      <h3>1. No Returns or Exchanges</h3>
      <p>Due to the exclusive and boutique nature of our products, we do not accept returns or exchanges for any reason, including:</p>
      <ul>
        <li>Change of mind</li>
        <li>Incorrect size or color selection</li>
        <li>Delayed delivery caused by courier partners</li>
        <li>Minor color differences (as images may vary slightly from actual products due to screen settings)</li>
      </ul>
      <p>Please read the product description, size details, and view all product images carefully before placing your order.</p>

      <h3>2. Order Cancellation</h3>
      <p>Once an order is placed and payment is confirmed, it cannot be canceled. We begin processing orders immediately to ensure quick delivery, hence cancellations are not possible.</p>

      <h3>3. Damaged or Defective Products</h3>
      <p>We perform thorough quality checks before dispatch. However, in the rare case that your product is severely damaged in transit or incorrect (wrong product shipped), please contact us within 24 hours of delivery with:</p>
      <ul>
        <li>Your order number</li>
        <li>Clear images of the product and packaging</li>
        <li>A brief explanation of the issue</li>
      </ul>
      <p>We will review the case and offer a suitable resolution at our sole discretion.</p>

      <h3>4. Contact for Support</h3>
      <p>
        For order-related concerns or assistance, reach out to us at:<br/>
        Email: <a href="mailto:rscollextion@gmail.com">rscollextion@gmail.com</a><br/>
        Phone: <a href="tel:+916304522676">6304522676</a>
      </p>
    </div>
  );
};

export default RefundPolicy;
