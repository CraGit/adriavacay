import SmallHeading from "@/components/SmallHeading";

export default async function BookingSuccessPage({ searchParams }) {
  const params = await searchParams;
  const method = params?.method;
  const ref = params?.ref;

  const isBank = method === "bank";

  return (
    <div className="container flex flex-col justify-center items-center py-48 md:py-72 px-4 md:px-0">
      <SmallHeading heading={isBank ? "Reservation held" : "Payment received"} />
      <p className="text-xl font-semibold pt-4 text-center max-w-xl">
        {isBank
          ? "Your dates are reserved. Please complete the bank transfer using the instructions we emailed you. Include the payment reference so we can match your payment."
          : "Thank you — your booking payment was successful. A confirmation email is on its way."}
      </p>
      {isBank && ref ? (
        <p className="text-base pt-4 text-center text-slate-600">
          Payment reference: <span className="font-mono font-medium">{ref}</span>
        </p>
      ) : null}
    </div>
  );
}
