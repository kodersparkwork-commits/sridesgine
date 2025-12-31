import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="page-container" style={{maxWidth: '900px', margin: '40px auto', padding: '0 16px'}}>
      <h1 style={{marginBottom: 8}}>Privacy Policy</h1>
      <p>
        At R.S Collextion, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard the information you provide while using our website, www.rscollextion.in. By accessing or using our site, you agree to the terms of this Privacy Policy.
      </p>

      <h3>1. Information We Collect</h3>
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Shipping and billing address</li>
        <li>Payment details (processed securely via payment gateway)</li>
        <li>Browsing behavior and device information (via cookies and analytics tools)</li>
      </ul>

      <h3>2. How We Use Your Information</h3>
      <ul>
        <li>Process and deliver your orders</li>
        <li>Communicate order updates or respond to inquiries</li>
        <li>Improve your shopping experience on our website</li>
        <li>Send promotional emails (only if you've opted in)</li>
        <li>Prevent fraud or misuse of our platform</li>
      </ul>

      <h3>3. Sharing Your Information</h3>
      <p>
        We do not sell, rent, or trade your personal information to third parties. However, we may share your data with trusted logistics partners like Shiprocket for order delivery, payment gateways for secure transaction processing, and service providers for analytics and customer service (if applicable).
      </p>

      <h3>4. Data Security</h3>
      <p>We take reasonable technical and organizational measures to protect your personal information. All transactions are processed through secure gateways and are not stored on our servers.</p>

      <h3>5. Cookies Policy</h3>
      <p>Our website uses cookies to enhance your browsing experience. These help us understand user preferences and track site performance and user interactions. You can disable cookies through your browser settings if you prefer.</p>

      <h3>6. Your Rights</h3>
      <p>
        You have the right to access or update your personal information, request deletion of your data (where applicable), and opt-out of promotional communications at any time. To make a data-related request, please email us at <a href="mailto:rscollextion.online@gmail.com">rscollextion.online@gmail.com</a>.
      </p>

      <h3>7. Changes to This Policy</h3>
      <p>We reserve the right to modify this Privacy Policy at any time. Changes will be updated on this page with a revised effective date. Continued use of the website implies acceptance of the updated policy.</p>
    </div>
  );
};

export default PrivacyPolicy;
