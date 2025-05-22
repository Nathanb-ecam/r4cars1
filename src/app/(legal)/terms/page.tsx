export default function TermsOfService() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-lg">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Labeuromed's services, you agree to be bound by
          these Terms of Service and all applicable laws and regulations.
        </p>

        <h2>2. Medical Products and Prescriptions</h2>
        <p>
          All purchases require a valid doctor's prescription. You must provide
          accurate prescription information and comply with all applicable
          medical regulations.
        </p>

        <h2>3. Ordering and Payment</h2>
        <p>
          By placing an order, you:
        </p>
        <ul>
          <li>Confirm that all information provided is accurate</li>
          <li>Agree to pay the full amount specified</li>
          <li>Authorize us to process your payment</li>
        </ul>

        <h2>4. Affiliate Program</h2>
        <p>
          Our affiliate program is subject to the following terms:
        </p>
        <ul>
          <li>Commissions are paid according to our affiliate agreement</li>
          <li>We reserve the right to modify commission rates</li>
          <li>Fraudulent activities will result in immediate termination</li>
        </ul>

        <h2>5. Intellectual Property</h2>
        <p>
          All content on this website, including text, graphics, logos, and
          images, is the property of Labeuromed and is protected by copyright
          laws.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          Labeuromed is not liable for any indirect, incidental, or
          consequential damages arising from your use of our services.
        </p>

        <h2>7. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use
          of our services constitutes acceptance of modified terms.
        </p>

        <h2>8. Contact</h2>
        <p>
          For questions about these Terms of Service, please contact us at
          legal@labeuromed.com.
        </p>
      </div>
    </main>
  );
} 