import React, { useEffect } from "react";

const pageTitle = "Child Safety Standards – Atmosphere";
const pageDescription = "Atmosphere Child Safety Standards and CSAE compliance policy.";

export default function ChildSafety() {
  useEffect(() => {
    document.title = pageTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", pageDescription);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = pageDescription;
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <main style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
      <section style={{ maxWidth: 900, width: "100%", margin: "0 16px" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 16 }}>Child Safety Standards – Atmosphere</h1>
        <p style={{ marginBottom: 24, color: "#555" }}>Last Updated: March 2026</p>
        <p style={{ marginBottom: 24 }}>
          Atmosphere ("we", "our", or "us") is committed to maintaining a safe and secure environment for all users.
        </p>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 12 }}>1. Zero Tolerance for Child Sexual Abuse and Exploitation (CSAE)</h2>
        <p style={{ marginBottom: 12 }}>
          Atmosphere strictly prohibits any content, behavior, or activity involving:
        </p>
        <ul style={{ marginBottom: 16, paddingLeft: 24 }}>
          <li>Child Sexual Abuse Material (CSAM)</li>
          <li>Sexual exploitation of minors</li>
          <li>Grooming or predatory behavior</li>
          <li>Solicitation of minors</li>
          <li>Any sexual content involving individuals under 18 years of age</li>
        </ul>
        <p style={{ marginBottom: 12 }}>Any violation will result in:</p>
        <ul style={{ marginBottom: 24, paddingLeft: 24 }}>
          <li>Immediate account suspension or termination</li>
          <li>Permanent ban from the platform</li>
          <li>Reporting to appropriate law enforcement authorities where legally required</li>
        </ul>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 12 }}>2. Monitoring and Reporting</h2>
        <p style={{ marginBottom: 12 }}>
          Atmosphere provides mechanisms for users to report inappropriate behavior or content.
        </p>
        <p style={{ marginBottom: 12 }}>
          All reports are reviewed and appropriate action is taken promptly.
        </p>
        <p style={{ marginBottom: 24 }}>
          Users can report concerns at:<br />
          <a href="mailto:support@atmosphere.vision">support@atmosphere.vision</a>
        </p>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 12 }}>3. Compliance with Applicable Laws</h2>
        <p style={{ marginBottom: 24 }}>
          Atmosphere complies with all applicable child protection laws and cooperates fully with law enforcement authorities when required.
        </p>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: 12 }}>4. Contact Information</h2>
        <p style={{ marginBottom: 8 }}>
          For child safety concerns:<br />
          Email: <a href="mailto:support@atmosphere.vision">support@atmosphere.vision</a><br />
          Website: <a href="https://atmosphere.vision" target="_blank" rel="noopener noreferrer">https://atmosphere.vision</a>
        </p>
      </section>
    </main>
  );
}
