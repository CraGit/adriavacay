import Link from "next/link";

import SmallHeading from "@/components/SmallHeading";
import { deleteRent } from "@/lib/myrent";

export default async function BookingCancelPage({ params, searchParams }) {
  const { locale } = await params;
  const query = await searchParams;
  const rentGuid =
    typeof query?.rent_guid === "string" ? query.rent_guid : null;

  if (rentGuid) {
    try {
      await deleteRent(rentGuid);
    } catch (error) {
      // Hold may already be gone (expired webhook, double visit, etc.)
      console.error("Cancel page MyRent hold cleanup:", error);
    }
  }

  return (
    <div className="container flex flex-col justify-center items-center py-48 md:py-72 px-4 md:px-0">
      <SmallHeading heading="Checkout cancelled" />
      <p className="text-xl font-semibold pt-4 text-center max-w-xl">
        Your card payment was not completed. The unpaid reservation hold has
        been released when possible. You can return to the property page and try
        again.
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
