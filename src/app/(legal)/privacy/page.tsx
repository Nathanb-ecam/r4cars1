import LegalTemplate from "@/components/legal/LegalTemplate";

export default function PrivacyPolicy() {
  
  const privacySections = [
      {
        title: "Information We Collect",
        p: "We collect information that you provide directly to us, including:",
        liElements: [
          "Name and contact information",
          "Doctor and prescription numbers",
          "Payment information",
          "Order history"
        ]
      },
      {
        title: "How We Use Your Information",
        p: "We use the information we collect to:",
        liElements: [
          "Process your orders and payments",
          "Communicate with you about your orders",
          "Track affiliate sales",
          "Improve our services"
        ]
      },
      {
        title: "Information Sharing",
        p: "We share your information with:",
        liElements: [
          "Payment processors (Stripe)",
          "Affiliate tracking services (GoAffPro)",
          "Service providers who assist in our operations"
        ]
      },
      {
        title: "Data Security",
        p: "We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure."
        // No liElements for this one
      },
      {
        title: "Your Rights",
        p: "You have the right to:",
        liElements: [
          "Access your personal information",
          "Correct inaccurate information",
          "Request deletion of your information",
          "Opt-out of marketing communications"
        ]
      }
    ];
  
  
  return (
    <LegalTemplate title="Privacy Policy" sections={privacySections}/>
  );
} 