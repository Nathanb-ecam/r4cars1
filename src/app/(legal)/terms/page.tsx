import LegalTemplate from "@/components/legal/LegalTemplate";

export default function TermsOfService() {
  const termsSections = 
  [
      {
        title: "Acceptance of Terms",
        p: "By accessing and using Labeuromed's services, you agree to be bound by these Terms of Service and all applicable laws and regulations."
      },
      {
        title: "Medical Products and Prescriptions",
        p: "All purchases require a valid doctor's prescription. You must provide accurate prescription information and comply with all applicable medical regulations."
      },
      {
        title: "Ordering and Payment",
        p: "By placing an order, you:",
        liElements: [
          "Confirm that all information provided is accurate",
          "Agree to pay the full amount specified",
          "Authorize us to process your payment"
        ]
      },
      {
        title: "Affiliate Program",
        p: "Our affiliate program is subject to the following terms:",
        liElements: [
          "Commissions are paid according to our affiliate agreement",
          "We reserve the right to modify commission rates",
          "Fraudulent activities will result in immediate termination"
        ]
      },
      {
        title: "Intellectual Property",
        p: "All content on this website, including text, graphics, logos, and images, is the property of Labeuromed and is protected by copyright laws."
      },
      {
        title: "Limitation of Liability",
        p: "Labeuromed is not liable for any indirect, incidental, or consequential damages arising from your use of our services."
      },
      {
        title: "Changes to Terms",
        p: "We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of modified terms."
      },
      {
        title: "Contact",
        p: "For questions about these Terms of Service, please contact us at legal@labeuromed.com."
      }
  ];
  
  
  
  return (
    <LegalTemplate title="Terms Policy" sections={termsSections}></LegalTemplate>
  );
} 