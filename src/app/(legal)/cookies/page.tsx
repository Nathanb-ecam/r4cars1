import LegalTemplate from "@/components/legal/LegalTemplate";

export default function CookiePolicy() {
  const cookiePolicy =[
      {
        title: "What Are Cookies",
        p: "Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience and enable certain features to work properly."
      },
      {
        title: "How We Use Cookies",
        p: "We use cookies for the following purposes:",
        liElements: [
          "Authentication and security",
          "Remembering your preferences",
          "Tracking affiliate sales",
          "Analyzing website usage"
        ]
      },
      {
        title: "Types of Cookies We Use",
        p: "Essential Cookies",
      },
      {
        title: "Essential Cookies",
        p: "These cookies are necessary for the website to function properly. They enable basic features like authentication and security."
      },
      {
        title: "Analytics Cookies",
        p: "We use analytics cookies to understand how visitors interact with our website. This helps us improve our services."
      },
      {
        title: "Affiliate Cookies",
        p: "These cookies help us track affiliate sales and ensure proper commission payments to our partners."
      },
      {
        title: "Managing Cookies",
        p: "You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed."
      },
      {
        title: "Third-Party Cookies",
        p: "Some cookies are placed by third-party services that appear on our pages, such as:",
        liElements: [
          "Payment processors (Stripe)",
          "Analytics services",
          "Affiliate tracking services (GoAffPro)"
        ]
      },
      {
        title: "Updates to This Policy",
        p: "We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page."
      },
      {
        title: "Contact Us",
        p: "If you have any questions about our Cookie Policy, please contact us at privacy@labeuromed.com."
      }
  ];
  
  
  return ( 

    <LegalTemplate title="Cookie Policy" sections={cookiePolicy}></LegalTemplate>
  );
} 