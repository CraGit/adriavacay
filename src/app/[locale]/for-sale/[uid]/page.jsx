import { notFound } from "next/navigation";
import { PrismicRichText, SliceZone } from "@prismicio/react";
import Link from "next/link";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import {
  FiPhone,
  GoPeople,
  LiaCompressArrowsAltSolid,
  LuBath,
  LuBedDouble,
  LuCircleDollarSign,
} from "@/assets/icons/vander";
import Amenities from "@/components/Amenities";
import Distances from "@/components/Distances";
import PhotoGallery from "@/components/Gallery";
import PropertyImage from "@/components/PropertyImage";
import { amenitiesMapping } from "@/data";
import rtfComponents from "@/lib/richText";

import PartialDiv from "@/components/PartialDiv";
// import BookingForm from "./booking-form";

import Reviews from "@/components/Reviews";

export default async function Page({ params }) {
  unstable_setRequestLocale(params.locale);
  const client = createClient();
  const page = await client
    .getByUID("for_sale_single", params.uid, { lang: params.locale })
    .catch(() => notFound());
  const uidEn =
    params.locale === "en-us"
      ? params.uid
      : page.alternate_languages.find((lang) => lang.lang === "en-us").uid;

  const pageEn = await client.getByUID("for_sale_single", uidEn, {
    lang: "en-us",
  });
  const photos = page.data.gallery.map((photo) => {
    return {
      src: photo.image.url,
      alt: photo.image.alt,
      width: Number(photo.image.dimensions?.width),
      height: Number(photo.image.dimensions?.height),
      description: photo.image.alt,
    };
  });
  const t = await getTranslations("for-sale-single");

  return (
    <>
      <section className="relative md:pb-24 pb-16 mt-20">
        <div className="container-fluid">
          <PropertyImage photos={photos} />
        </div>

        <div className="container md:mt-24 mt-16">
          <div className="md:flex">
            <div className="lg:w-2/3 md:w-1/2 md:p-4 px-3">
              <h4 className="text-2xl font-medium">{page.data.heading}</h4>

              <ul className="py-6 flex items-center list-none flex-wrap gap-y-2">
                <li className="flex items-center lg:me-6 me-4">
                  <GoPeople className=" lg:text-3xl text-2xl me-2 text-green-600" />
                  <span className="lg:text-xl">
                    {page.data.guestsPrikaz} {t("guests")}
                  </span>
                </li>
                <li className="flex items-center lg:me-6 me-4">
                  <LiaCompressArrowsAltSolid className=" lg:text-3xl text-2xl me-2 text-green-600" />
                  <span className="lg:text-xl">{page.data.sqm}m2</span>
                </li>

                <li className="flex items-center lg:me-6 me-4">
                  <LuBedDouble className=" lg:text-3xl text-2xl me-2 text-green-600" />
                  <span className="lg:text-xl">{page.data.bedrooms}</span>
                </li>

                <li className="flex items-center lg:me-6 me-4">
                  <LuBath className=" lg:text-3xl text-2xl me-2 text-green-600" />
                  <span className="lg:text-xl">{page.data.bathrooms}</span>
                </li>
                <li className="flex items-center lg:me-6 me-4">
                  <LuCircleDollarSign className=" lg:text-3xl text-2xl me-2 text-green-600" />
                  <span className="lg:text-xl">{page.data.price}</span>
                </li>
              </ul>

              <PartialDiv>
                <PrismicRichText
                  field={page.data.content}
                  components={rtfComponents}
                />
              </PartialDiv>
              {/* DISTANCES */}
              {/* <Distances
                heading={t("distances")}
                distances={page.data.distances}
              /> */}
              {/* AMENITIES */}
              {/* <Amenities heading={t("amenities")} amenities={amenities} /> */}

              {/* REVIEW */}
              {/* <Reviews reviews={page.data.reviews} /> */}
              {/* GALLERY */}
              <div className="mt-4">
                {photos && photos.length > 0 && (
                  <PhotoGallery photos={photos} heading={t("gallery")} />
                )}
              </div>
              <div className="w-full leading-[0] border-0 mt-6">
                <iframe
                  src={page.data.google_map_embed}
                  style={{ border: "0" }}
                  className="w-full h-[500px]"
                  allowFullScreen
                ></iframe>
              </div>
              {/* <PrismicRichText
                field={paymentDetails.data.content}
                components={rtfComponents}
              />
              <PrismicRichText
                field={cancelationPolicy.data.content}
                components={rtfComponents}
              /> */}
            </div>

            <div
              className="lg:w-1/3 md:w-1/2 md:p-4 px-3 mt-8 md:mt-0"
              id="booking-form"
            >
              <div className="sticky top-20">
                {/* <PriceDisplay
                  prices={pageEn.data.pricing}
                  discounts={pageEn.data.discounts}
                  deposit={pageEn.data.security_deposit}
                /> */}
                {/* <BookingForm
                  uid={params.uid}
                  occupiedDates={occupiedDates}
                  occupiedRanges={occupiedRanges}
                  priceRanges={pageEn.data.pricing}
                  className="mt-6"
                /> */}
                {/* <div className="mt-12 rounded-md bg-slate-50 dark:bg-slate-800 shadow dark:shadow-gray-700">
                  <div className="p-6">
                    <h5 className="text-2xl font-medium">Price:</h5>

                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xl font-medium">for 5 nights</span>
                      <span className="bg-green-600/10 text-green-600 text-sm px-2.5 py-0.75 rounded h-6">
                        Best price Guarantee
                      </span>
                    </div>

                    <ul className="list-none mt-4">
                      <li className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">
                          Check-in - Check-out
                        </span>
                        <span className="font-medium text-sm">05 - 09.09</span>
                      </li>

                      <li className="flex justify-between items-center mt-2">
                        <span className="text-slate-400 text-sm">
                          Safety Deposit
                        </span>
                        <span className="font-medium text-sm">€ 186</span>
                      </li>

                      <li className="flex justify-between items-center mt-2">
                        <span className="text-slate-400 text-sm">Total</span>
                        <span className="font-medium text-sm">€ 1497</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex">
                    <div className="p-1 flex-grow">
                      <Link
                        href="#"
                        className="btn bg-green-600 hover:bg-green-700 text-white rounded-md w-full"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div> */}

                {/* <div className="flex mt-6">
                  <div className="flex-grow">
                    <Link
                      href="#"
                      className="btn bg-green-600 hover:bg-green-700 text-white rounded-md w-full"
                    >
                      Book Now
                    </Link>
                  </div>
                </div> */}

                <div className="mt-12 text-center">
                  <h3 className="mb-6 text-xl leading-normal font-medium text-black dark:text-white">
                    {t("have-a-question")}
                  </h3>

                  <div className="mt-6">
                    <Link
                      href="/contact"
                      className="btn bg-transparent hover:bg-green-600 border border-green-600 text-green-600 hover:text-white rounded-md"
                    >
                      <FiPhone className="align-middle me-2" />{" "}
                      {t("contact-us")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SliceZone slices={page.data.slices} components={components} />
    </>
  );
}

export async function generateMetadata({ params }) {
  const client = createClient();
  const page = await client
    .getByUID("for_sale_single", params.uid, { lang: params.locale })
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("for_sale_single", {
    lang: "*",
    fetchOptions: { cache: "no-store" },
  });

  return pages.map((page) => {
    const locale = page.lang && page.lang.startsWith("en") ? "en-us" : page.lang && page.lang.startsWith("de") ? "de" : page.lang;
    return { uid: page.uid, locale };
  });
}
