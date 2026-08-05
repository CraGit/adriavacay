import Link from "next/link";

import SmallHeading from "@/components/SmallHeading";

export default async function BookingCancelPage({ params }) {
  const { locale } = await params;

  return (
    <div className="container flex flex-col justify-center items-center py-48 md:py-72 px-4 md:px-0">
      <SmallHeading heading="Checkout cancelled" />
      <p className="text-xl font-semibold pt-4 text-center max-w-xl">
        Your card payment was not completed. If you abandoned Stripe Checkout,
        the unpaid hold will be removed automatically when the session expires.
        You can return to the property page and try again.
      </p>
      <Link
        href={`/${locale}/accommodation`}
        className="btn bg-green-600 hover:bg-green-700 text-white rounded-md mt-8"
      >
        Browse accommodation
      </Link>
    </div>
  );
}
