import {
  DetailTable,
  EmailIntro,
  EmailLayout,
  EmailOutro,
  HighlightBox,
} from "./components/email-layout";

export function BankGuestInstructionsEmail({
  guestName,
  villa,
  fromDate,
  untilDate,
  guests,
  pricingRows,
  beneficiary,
  bankName,
  iban,
  paymentRef,
}) {
  return (
    <EmailLayout
      preview={`Bank transfer instructions for ${villa}`}
      title="Bank transfer instructions"
      footerNote="Your reservation is held unpaid until we receive the transfer."
    >
      <EmailIntro>Dear {guestName},</EmailIntro>
      <EmailIntro>Thank you for booking {villa}.</EmailIntro>
      <DetailTable
        rows={[
          { label: "Stay", value: `${fromDate} – ${untilDate}` },
          { label: "Guests", value: guests },
          ...pricingRows,
        ]}
      />
      <EmailIntro>
        Please transfer the amount due using these bank details:
      </EmailIntro>
      <HighlightBox
        title="Bank details"
        rows={[
          { label: "Beneficiary", value: beneficiary },
          { label: "Bank", value: bankName },
          { label: "IBAN", value: iban },
          { label: "Payment reference (important)", value: paymentRef },
        ]}
      />
      <EmailOutro>
        Your reservation is held unpaid until we receive the transfer. If you
        have questions, reply to this email.
      </EmailOutro>
    </EmailLayout>
  );
}

export function BankAgencyNotificationEmail({
  villa,
  guestName,
  guestEmail,
  guestPhone,
  fromDate,
  untilDate,
  guests,
  pricingRows,
  paymentRef,
  rentGuid,
}) {
  return (
    <EmailLayout
      preview={`Unpaid bank booking — ${villa}`}
      title="New bank-transfer booking"
      footerNote="UNPAID hold in MyRent — mark paid after the wire arrives."
    >
      <EmailIntro>
        New bank-transfer booking (UNPAID hold in MyRent).
      </EmailIntro>
      <DetailTable
        rows={[
          { label: "Villa", value: villa },
          { label: "Guest", value: guestName },
          { label: "Email", value: guestEmail },
          { label: "Phone", value: guestPhone },
          { label: "Dates", value: `${fromDate} – ${untilDate}` },
          { label: "Guests", value: guests },
          ...pricingRows,
          { label: "Payment reference / erp_id", value: paymentRef },
          { label: "MyRent rent_guid", value: rentGuid },
        ]}
      />
      <EmailOutro>
        Mark this booking as paid (or partially paid) manually in MyRent after
        the wire transfer arrives. Cancel unpaid holds in MyRent if payment does
        not arrive.
      </EmailOutro>
    </EmailLayout>
  );
}
