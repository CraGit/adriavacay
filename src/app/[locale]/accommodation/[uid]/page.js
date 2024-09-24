import { PrismicRichText, SliceZone } from "@prismicio/react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  FiPhone,
  GoPeople,
  LiaCompressArrowsAltSolid,
  LuBath,
  LuBedDouble,
} from "@/assets/icons/vander";
import Amenities from "@/components/Amenities";
import Distances from "@/components/Distances";
import PhotoGallery from "@/components/Gallery";
import PropertyImage from "@/components/PropertyImage";
import { amenitiesMapping } from "@/data";
import rtfComponents from "@/lib/richText";
import { occupiedDatesFromIcal, occupiedRangesFromIcal } from "@/lib/utils";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

import PartialDiv from "@/components/PartialDiv";
import BookingForm from "./booking-form";
import PriceDisplay from "./price-display";

export default async function Page({ params }) {
  const client = createClient();
  const page = await client
    .getByUID("accommodation_single", params.uid, { lang: params.locale })
    .catch(() => notFound());
  const cancelationPolicy = await client.getSingle("cancelation_policy");
  const paymentDetails = await client.getSingle("payment_details");
  const occupiedDates = await occupiedDatesFromIcal(page.data.ical);
  const occupiedRanges = await occupiedRangesFromIcal(page.data.ical);

  const photos = page.data.gallery.map((photo) => {
    return {
      src: photo.image.url,
      alt: photo.image.alt,
      width: Number(photo.image.dimensions?.width),
      height: Number(photo.image.dimensions?.height),
      description: photo.image.alt,
    };
  });

  const amenities = amenitiesMapping
    .filter((item) => page.data[item.key])
    .map((item) => item.label);

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

              <ul className="py-6 flex items-center list-none">
                <li className="flex items-center lg:me-6 me-4">
                  <GoPeople className=" lg:text-3xl text-2xl me-2 text-green-600" />
                  <span className="lg:text-xl">
                    {page.data.guestsPrikaz} Guests
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

                <li className="flex items-center">
                  <LuBath className=" lg:text-3xl text-2xl me-2 text-green-600" />
                  <span className="lg:text-xl">{page.data.bathrooms}</span>
                </li>
              </ul>
              {/* 
              <p className="text-slate-400">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi
                nesciunt.
              </p>
              <p className="text-slate-400 mt-4">
                But I must explain to you how all this mistaken idea of
                denouncing pleasure and praising pain was born and I will give
                you a complete account of the system, and expound the actual
                teachings of the great explorer of the truth, the master-builder
                of human happiness.
              </p>
              <p className="text-slate-400 mt-4">
                Nor again is there anyone who loves or pursues or desires to
                obtain pain of itself, because it is pain, but because
                occasionally circumstances occur in which toil and pain can
                procure him some great pleasure.
              </p> */}
              <PartialDiv>
                <PrismicRichText
                  field={page.data.content}
                  components={rtfComponents}
                />
              </PartialDiv>
              {/* DISTANCES */}
              <Distances distances={page.data.distances} />
              {/* AMENITIES */}
              <Amenities amenities={amenities} />

              <div className="w-full leading-[0] border-0 mt-6">
                <iframe
                  src={page.data.google_map_embed}
                  style={{ border: "0" }}
                  className="w-full h-[500px]"
                  allowFullScreen
                ></iframe>
              </div>

              {/* GALLERY */}
              {photos && photos.length > 0 && (
                <PhotoGallery photos={photos} heading="Gallery" />
              )}
              <PrismicRichText
                field={paymentDetails.data.content}
                components={rtfComponents}
              />
              <PrismicRichText
                field={cancelationPolicy.data.content}
                components={rtfComponents}
              />
            </div>

            <div
              className="lg:w-1/3 md:w-1/2 md:p-4 px-3 mt-8 md:mt-0"
              id="booking-form"
            >
              <div className="sticky top-20">
                <PriceDisplay
                  prices={page.data.pricing}
                  discounts={page.data.discounts}
                  deposit={page.data.security_deposit}
                />
                <BookingForm
                  uid={params.uid}
                  occupiedDates={occupiedDates}
                  occupiedRanges={occupiedRanges}
                  priceRanges={page.data.pricing}
                  className="mt-6"
                />
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
                    Have a Question ? Get in touch!
                  </h3>

                  <div className="mt-6">
                    <Link
                      href="/contact"
                      className="btn bg-transparent hover:bg-green-600 border border-green-600 text-green-600 hover:text-white rounded-md"
                    >
                      <FiPhone className="align-middle me-2" /> Contact us
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
    .getByUID("accommodation_single", params.uid, { lang: params.locale })
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams({ params }) {
  const client = createClient();
  const pages = await client.getAllByType("accommodation_single", {
    lang: params.locale,
  });

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
