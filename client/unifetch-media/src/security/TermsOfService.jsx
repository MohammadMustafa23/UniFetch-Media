import { Link } from "react-router-dom";
import "./PrivacyPolicy.css";

const termsSections = [
  {
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using UniFetch Media, you agree to be bound by these Terms of Service and all applicable laws. If you do not agree with these terms, please do not use the service.",
    ],
  },
  {
    title: "2. Purpose of UniFetch",
    content: [
      "UniFetch Media is a media management and downloading tool that helps users organize and download content they are legally authorized to access. UniFetch does not host, own, or distribute copyrighted media.",
    ],
  },
  {
    title: "3. Supported Platforms",
    content: [
      "UniFetch may support links from third-party platforms such as YouTube, Instagram, Facebook, TikTok, X (Twitter), and other supported services. UniFetch is an independent application and is not affiliated with, endorsed by, or sponsored by any of these companies.",
    ],
  },
  {
    title: "4. User Responsibilities",
    list: [
      "Use UniFetch only for lawful purposes.",
      "Download only content you own or have permission to access.",
      "Comply with the Terms of Service of the original platform.",
      "Keep your account information secure.",
      "Respect copyright and intellectual property rights.",
    ],
  },
  {
    title: "5. Copyright Compliance",
    content: [
      "You are solely responsible for ensuring that any media downloaded through UniFetch complies with applicable copyright laws and the terms of the source platform. UniFetch does not encourage or promote copyright infringement.",
    ],
  },
  {
    title: "6. Prohibited Uses",
    list: [
      "Downloading copyrighted content without permission.",
      "Using UniFetch for illegal or fraudulent activities.",
      "Attempting to reverse engineer or exploit the service.",
      "Disrupting or interfering with UniFetch infrastructure.",
      "Using automated tools to abuse the platform.",
    ],
  },
  {
    title: "7. Third-Party Services",
    content: [
      "UniFetch integrates with third-party providers such as cloud storage services, authentication providers, and analytics platforms. Your use of these services is subject to their own terms and privacy policies.",
    ],
  },
  {
    title: "8. Service Availability",
    content: [
      "We strive to keep UniFetch available and reliable. However, features may change, platforms may restrict access, and service interruptions may occur without prior notice.",
    ],
  },
  {
    title: "9. Disclaimer",
    content: [
      "UniFetch is provided 'as is' without warranties of any kind. We do not guarantee compatibility with every platform, uninterrupted availability, or that third-party services will continue to work.",
    ],
  },
  {
    title: "10. Limitation of Liability",
    content: [
      "To the maximum extent permitted by law, UniFetch Media shall not be liable for any loss of data, downloaded content, business interruption, or indirect damages resulting from the use of the service.",
    ],
  },
  {
    title: "11. Updates to These Terms",
    content: [
      "We may update these Terms of Service from time to time. Continued use of UniFetch after changes are published constitutes acceptance of the updated terms.",
    ],
  },
  {
    title: "12. Contact",
    content: [
      "If you have questions regarding these Terms of Service, please contact us through the Support page or our GitHub repository.",
    ],
  },
];

export default function TermsOfService() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <Link to="/" className="legal-back">
          ← Back to Home
        </Link>

        <h1>Terms of Service</h1>

        <p className="legal-updated">Last Updated: July 22, 2026</p>

        <p className="legal-intro">
          These Terms of Service govern your use of UniFetch Media. By using our
          platform, you agree to comply with these terms and all applicable laws
          and regulations.
        </p>

        {termsSections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>

            {section.content?.map((text, index) => (
              <p key={index}>{text}</p>
            ))}

            {section.list && (
              <ul>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
