export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-lg">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, including:
        </p>
        <ul>
          <li>Name and contact information</li>
          <li>Doctor and prescription numbers</li>
          <li>Payment information</li>
          <li>Order history</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Process your orders and payments</li>
          <li>Communicate with you about your orders</li>
          <li>Track affiliate sales</li>
          <li>Improve our services</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>
          We share your information with:
        </p>
        <ul>
          <li>Payment processors (Stripe)</li>
          <li>Affiliate tracking services (GoAffPro)</li>
          <li>Service providers who assist in our operations</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal
          information. However, no method of transmission over the Internet is
          100% secure.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          You have the right to:
        </p>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Opt-out of marketing communications</li>
        </ul>

        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at privacy@labeuromed.com.
        </p>
      </div>
    </main>
  );
} 