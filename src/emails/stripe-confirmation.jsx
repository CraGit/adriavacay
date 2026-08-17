import {
  DetailTable,
  EmailIntro,
  EmailLayout,
  EmailOutro,
} from "./components/email-layout";

export function StripeGuestConfirmationEmail({
  guestName,
  villa,
  fromDate,
  untilDate,
  guests,
  total,
  amountDue,
  reference,
}) {
  return (
    <EmailLayout
      preview={`Payment received for ${villa}`}
      title="Booking confirmed"
      footerNote="We look forward to hosting you."
    >
      <EmailIntro>Dear {guestName},</EmailIntro>
      <EmailIntro>
        Thank you — your payment for {villa} was received.
      </EmailIntro>
      <DetailTable
        rows={[
          { label: "Stay", value: `${fromDate} – ${untilDate}` },
          { label: "Guests", value: guests },
          { label: "Stay total", value: `EUR ${total}` },
          { label: "Paid now", value: `EUR ${amountDue}` },
          { label: "Reference", value: reference },
        ]}
      />
      <EmailOutro>We look forward to hosting you.</EmailOutro>
    </EmailLayout>
  );
}

export function StripeAgencyNotificationEmail({
  villa,
  guestName,
  guestEmail,
  guestPhone,
  fromDate,
  untilDate,
  guests,
  total,
  amountDue,
  percent,
  erpId,
  rentGuid,
  sessionId,
}) {
  return (
    <EmailLayout
      preview={`Stripe booking paid — ${villa}`}
      title="Stripe booking paid"
    >
      <EmailIntro>A guest completed card payment for a booking.</EmailIntro>
      <DetailTable
        rows={[
          { label: "Villa", value: villa },
          { label: "Guest", value: guestName },
          { label: "Email", value: guestEmail },
          { label: "Phone", value: guestPhone },
          { label: "Dates", value: `${fromDate} – ${untilDate}` },
          { label: "Guests", value: guests },
          { label: "Payment method", value: "Card (Stripe)" },
          { label: "Stay total", value: `EUR ${total}` },
          {
            label: `Paid now (${percent}%)`,
            value: `EUR ${amountDue}`,
          },
          { label: "erp_id", value: erpId },
          { label: "rent_guid", value: rentGuid },
          { label: "Stripe session", value: sessionId },
        ]}
      />
    </EmailLayout>
  );
}
