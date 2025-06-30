"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ContactBar() {
  const pathname = usePathname();

  const t = useTranslations("booking");

  // Split the pathname into segments
  const pathSegments = pathname.split("/").filter(Boolean);

  // Check if one of the segments is "accommodation" and if there is exactly one more segment after it
  const accommodationIndex = pathSegments.indexOf("accommodation");
  const isAccommodationWithSubPath =
    accommodationIndex !== -1 && accommodationIndex < pathSegments.length - 1;

  // Function to handle scrolling with offset and delay
  const scrollToBookingForm = (e) => {
    e.preventDefault(); // Prevent the default anchor behavior

    const navbarHeight = 80; // Adjust this based on your actual navbar height

    setTimeout(() => {
      const bookingForm = document.getElementById("booking-form");

      if (bookingForm) {
        const formPosition =
          bookingForm.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: formPosition - navbarHeight, // Apply the offset
          behavior: "smooth",
        });
      }
    }, 100); // Delay the scroll action by 50ms to ensure elements are fully loaded
  };

  return (
    <div className="fixed bottom-0 right-0 mb-1 mr-2 md:mb-2 md:mr-3 z-20 flex flex-row gap-2 h-16 justify-between opacity-95">
      {isAccommodationWithSubPath ? (
        <>
          <div className="absolute bottom-2 right-2 md:hidden">
            <a
              href="#booking-form"
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 min-w-28 text-center"
              onClick={scrollToBookingForm} // Add click handler here
            >
              {t("check-price")}
            </a>
          </div>
          <a
            className="hover:opacity-90 transition-all duration-100 hover:scale-105 hidden md:block"
            href="https://wa.me/385976663532"
          >
            <Image
              src="/images/whatsapp.svg"
              alt="language"
              height="48"
              width="48"
            />
          </a>
        </>
      ) : (
        <a
          className="hover:opacity-90 transition-all duration-100 hover:scale-105"
          href="https://wa.me/385976663532"
        >
          <Image
            src="/images/whatsapp.svg"
            alt="language"
            height="48"
            width="48"
          />
        </a>
      )}
    </div>
  );
}
