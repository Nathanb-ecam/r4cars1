export default function CookiePolicy() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
      <div className="prose prose-lg">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. What Are Cookies</h2>
        <p>
          Cookies are small text files that are placed on your device when you
          visit our website. They help us provide you with a better experience
          and enable certain features to work properly.
        </p>

        <h2>2. How We Use Cookies</h2>
        <p>We use cookies for the following purposes:</p>
        <ul>
          <li>Authentication and security</li>
          <li>Remembering your preferences</li>
          <li>Tracking affiliate sales</li>
          <li>Analyzing website usage</li>
        </ul>

        <h2>3. Types of Cookies We Use</h2>
        <h3>Essential Cookies</h3>
        <p>
          These cookies are necessary for the website to function properly. They
          enable basic features like authentication and security.
        </p>

        <h3>Analytics Cookies</h3>
        <p>
          We use analytics cookies to understand how visitors interact with our
          website. This helps us improve our services.
        </p>

        <h3>Affiliate Cookies</h3>
        <p>
          These cookies help us track affiliate sales and ensure proper
          commission payments to our partners.
        </p>

        <h2>4. Managing Cookies</h2>
        <p>
          You can control and/or delete cookies as you wish. You can delete all
          cookies that are already on your computer and you can set most
          browsers to prevent them from being placed.
        </p>

        <h2>5. Third-Party Cookies</h2>
        <p>
          Some cookies are placed by third-party services that appear on our
          pages, such as:
        </p>
        <ul>
          <li>Payment processors (Stripe)</li>
          <li>Analytics services</li>
          <li>Affiliate tracking services (GoAffPro)</li>
        </ul>

        <h2>6. Updates to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. We will notify you
          of any changes by posting the new policy on this page.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about our Cookie Policy, please contact us
          at privacy@labeuromed.com.
        </p>
      </div>
    </main>
  );
} 