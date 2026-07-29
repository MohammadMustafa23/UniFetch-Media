import { Link } from "react-router-dom";
import "./PrivacyPolicy.css";

const privacySections = [
  {
    title: "1. Information We Collect",
    content: [
      "When you create an account or use UniFetch Media, we may collect information such as your name, email address, account preferences, download settings, browser type, IP address, device information, and operating system. This information helps us provide and improve the service.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    list: [
      "Provide and maintain your UniFetch account.",
      "Process download requests.",
      "Remember your preferences and settings.",
      "Improve performance, reliability, and security.",
      "Respond to support requests and feedback.",
      "Detect abuse, spam, or unauthorized activity.",
    ],
  },
  {
    title: "3. Downloaded Media",
    content: [
      "UniFetch temporarily processes media files to complete your requested download. Depending on your selected storage provider, files may be stored on your local device or connected cloud storage. Temporary files on our servers are periodically deleted.",
    ],
  },
  {
    title: "4. Third-Party Platforms",
    content: [
      "UniFetch supports links from third-party platforms such as YouTube, Instagram, Facebook, TikTok, X (Twitter), and other supported services. UniFetch is not affiliated with, endorsed by, or sponsored by any of these platforms.",
    ],
  },
  {
    title: "5. Copyright & User Responsibility",
    content: [
      "You are solely responsible for ensuring that you have the legal right or permission to download any content using UniFetch. You must comply with the Terms of Service and copyright policies of the platform from which the content originates. UniFetch does not encourage or promote copyright infringement.",
    ],
  },
  {
    title: "6. Cookies & Local Storage",
    content: [
      "We use cookies and local storage to keep you signed in, remember your preferences, improve your experience, and maintain essential application functionality.",
    ],
  },
  {
    title: "7. Security",
    content: [
      "We implement industry-standard security practices to protect your information. While we strive to keep your data secure, no method of internet transmission or electronic storage is completely secure.",
    ],
  },
  {
    title: "8. Third-Party Services",
    content: [
      "UniFetch may use trusted third-party services including cloud storage providers, authentication providers, analytics tools, hosting providers, and payment providers. These services operate under their own privacy policies.",
    ],
  },
  {
    title: "9. Your Rights",
    content: [
      "Depending on your jurisdiction, you may have the right to access, update, correct, export, or delete your personal information. You may also request account deletion at any time.",
    ],
  },
  {
    title: "10. Changes to this Privacy Policy",
    content: [
      "We may update this Privacy Policy as UniFetch evolves or as required by law. Any changes will become effective once published on this page.",
    ],
  },
  {
    title: "11. Contact Us",
    content: [
      "If you have questions regarding this Privacy Policy, please contact us through our Support page or GitHub repository.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <Link to="/" className="legal-back">
          ← Back to Home
        </Link>

        <h1>Privacy Policy</h1>

        <p className="legal-updated">Last Updated: July 22, 2026</p>

        <p className="legal-intro">
          Your privacy matters to us. This Privacy Policy explains what
          information UniFetch Media collects, how we use it, and the
          responsibilities associated with using our platform.
        </p>

        {privacySections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>

            {section.content?.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
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
