import {
  DetailTable,
  EmailIntro,
  EmailLayout,
} from "./components/email-layout";

export function InquiryNotificationEmail({
  name,
  email,
  guests,
  dateFrom,
  dateTo,
  villa,
  message,
}) {
  return (
    <EmailLayout
      preview={`Enquiry from ${name} — ${villa}`}
      title="New booking enquiry"
    >
      <EmailIntro>A guest submitted an enquiry from the website.</EmailIntro>
      <DetailTable
        rows={[
          { label: "Name", value: name },
          { label: "Email", value: email },
          { label: "Guests", value: guests },
          { label: "Date from", value: dateFrom },
          { label: "Date to", value: dateTo },
          { label: "Villa", value: villa },
          { label: "Message", value: message || "(none)" },
        ]}
      />
    </EmailLayout>
  );
}

export function ContactNotificationEmail({ name, email, subject, message }) {
  return (
    <EmailLayout
      preview={`Website enquiry from ${name}`}
      title="Website contact enquiry"
    >
      <EmailIntro>A visitor sent a message from the contact form.</EmailIntro>
      <DetailTable
        rows={[
          { label: "Name", value: name },
          { label: "Email", value: email },
          { label: "Subject", value: subject },
          { label: "Message", value: message },
        ]}
      />
    </EmailLayout>
  );
}
