import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export const brand = {
  primary: "#2e4053",
  accent: "#AC8B16",
  secondary: "#f1c40f",
  muted: "#64748b",
  border: "#e2e8f0",
  pageBg: "#eef1f4",
  cardBg: "#ffffff",
  softBg: "#f8fafc",
};

/**
 * Shared AdriaVacay email chrome — navy + gold, League Spartan-friendly stack.
 */
export function EmailLayout({ preview, title, children, footerNote }) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.brandMark}>AdriaVacay</Text>
            <Text style={styles.brandTagline}>
              Tailored stays, timeless memories
            </Text>
          </Section>

          <Section style={styles.card}>
            {title ? <Heading style={styles.heading}>{title}</Heading> : null}
            {children}
          </Section>

          <Section style={styles.footer}>
            {footerNote ? (
              <Text style={styles.footerNote}>{footerNote}</Text>
            ) : null}
            <Text style={styles.footerBrand}>AdriaVacay</Text>
            <Text style={styles.footerMuted}>
              This message was sent regarding a booking or enquiry on
              adriavacay.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function EmailIntro({ children }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

export function EmailOutro({ children }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

export function DetailTable({ rows }) {
  return (
    <Section style={styles.detailBox}>
      {rows
        .filter((row) => row && (row.value || row.value === 0))
        .map((row, index) => (
          <Section key={`${row.label}-${index}`} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{row.label}</Text>
            <Text style={styles.detailValue}>{String(row.value)}</Text>
          </Section>
        ))}
    </Section>
  );
}

export function HighlightBox({ title, rows }) {
  return (
    <Section style={styles.highlightBox}>
      {title ? <Text style={styles.highlightTitle}>{title}</Text> : null}
      {rows
        .filter((row) => row && row.value)
        .map((row, index) => (
          <Section key={`${row.label}-${index}`} style={styles.detailRow}>
            <Text style={styles.highlightLabel}>{row.label}</Text>
            <Text style={styles.highlightValue}>{String(row.value)}</Text>
          </Section>
        ))}
    </Section>
  );
}

export function EmailDivider() {
  return <Hr style={styles.hr} />;
}

const styles = {
  body: {
    backgroundColor: brand.pageBg,
    fontFamily:
      '"League Spartan", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    margin: "0",
    padding: "32px 12px",
  },
  container: {
    margin: "0 auto",
    maxWidth: "560px",
  },
  header: {
    padding: "8px 8px 20px",
    textAlign: "center",
  },
  brandMark: {
    color: brand.primary,
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "0.04em",
    margin: "0",
  },
  brandTagline: {
    color: brand.accent,
    fontSize: "12px",
    fontWeight: "500",
    letterSpacing: "0.08em",
    margin: "6px 0 0",
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: brand.cardBg,
    borderRadius: "12px",
    border: `1px solid ${brand.border}`,
    padding: "32px 28px",
  },
  heading: {
    color: brand.primary,
    fontSize: "22px",
    fontWeight: "700",
    lineHeight: "1.3",
    margin: "0 0 16px",
  },
  paragraph: {
    color: brand.primary,
    fontSize: "15px",
    lineHeight: "1.6",
    margin: "0 0 16px",
  },
  detailBox: {
    backgroundColor: brand.softBg,
    borderRadius: "8px",
    border: `1px solid ${brand.border}`,
    margin: "8px 0 20px",
    padding: "4px 16px",
  },
  detailRow: {
    borderBottom: `1px solid ${brand.border}`,
    padding: "12px 0",
  },
  detailLabel: {
    color: brand.muted,
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.04em",
    margin: "0 0 4px",
    textTransform: "uppercase",
  },
  detailValue: {
    color: brand.primary,
    fontSize: "15px",
    fontWeight: "600",
    lineHeight: "1.45",
    margin: "0",
    whiteSpace: "pre-wrap",
  },
  highlightBox: {
    backgroundColor: "#fbf8ef",
    borderRadius: "8px",
    border: `1px solid ${brand.accent}`,
    margin: "8px 0 20px",
    padding: "16px",
  },
  highlightTitle: {
    color: brand.accent,
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.06em",
    margin: "0 0 12px",
    textTransform: "uppercase",
  },
  highlightLabel: {
    color: brand.muted,
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.04em",
    margin: "0 0 4px",
    textTransform: "uppercase",
  },
  highlightValue: {
    color: brand.primary,
    fontSize: "15px",
    fontWeight: "700",
    lineHeight: "1.45",
    margin: "0",
    whiteSpace: "pre-wrap",
  },
  hr: {
    borderColor: brand.border,
    borderTop: `1px solid ${brand.border}`,
    margin: "8px 0 20px",
  },
  footer: {
    padding: "24px 8px 0",
    textAlign: "center",
  },
  footerNote: {
    color: brand.muted,
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "0 0 12px",
  },
  footerBrand: {
    color: brand.primary,
    fontSize: "14px",
    fontWeight: "700",
    margin: "0 0 4px",
  },
  footerMuted: {
    color: brand.muted,
    fontSize: "12px",
    lineHeight: "1.5",
    margin: "0",
  },
};
