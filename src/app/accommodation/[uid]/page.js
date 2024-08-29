import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import PropertyImage from "@/app/components/PropertyImage";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import {
  LiaCompressArrowsAltSolid,
  LuBedDouble,
  LuBath,
  FiPhone,
  GoPeople,
} from "../../assets/icons/vander";
import Link from "next/link";
import { PrismicRichText } from "@prismicio/react";
import rtfComponents from "@/app/utilities/richText";
import PhotoGallery from "@/app/components/Gallery";
import Distances from "@/app/components/Distances";
import Amenities from "@/app/components/Amenities";

export default async function Page({ params }) {
  const client = createClient();
  const page = await client
    .getByUID("accommodation_single", params.uid)
    .catch(() => notFound());

  const photos = page.data.gallery.map((photo) => {
    return {
      src: photo.image.url,
      alt: photo.image.alt,
      width: Number(photo.image.dimensions?.width),
      height: Number(photo.image.dimensions?.height),
    };
  });
  const amenities = [];
  if (page.data.infinity_pool) amenities.push("Infinity Pool");
  if (page.data.heated_pool) amenities.push("Heated Pool");
  if (page.data.salt_pool) amenities.push("Salt Pool");
  if (page.data.swimming_pool) amenities.push("Swimming Pool");
  if (page.data.indoor_pool) amenities.push("Indoor Pool");
  if (page.data.sauna) amenities.push("Sauna");
  if (page.data.jacuzzi) amenities.push("Jacuzzi");
  if (page.data.outdoor_shower) amenities.push("Outdoor Shower");
  if (page.data.sun_deck_chairs) amenities.push("Sun Deck Chairs");
  if (page.data.lounge_chairs) amenities.push("Lounge Chairs");
  if (page.data.parasol) amenities.push("Parasol");
  if (page.data.bbq_wood) amenities.push("BBQ Wood");
  if (page.data.bbq_gas) amenities.push("BBQ Gas");
  if (page.data.outdoor_dining_area) amenities.push("Outdoor Dining Area");
  if (page.data.patio) amenities.push("Patio");
  if (page.data.summer_kitchen) amenities.push("Summer Kitchen");
  if (page.data.garden) amenities.push("Garden");
  if (page.data.balcony) amenities.push("Balcony");
  if (page.data.organic_garden) amenities.push("Organic Garden");
  if (page.data.playground) amenities.push("Playground");
  if (page.data.trampoline) amenities.push("Trampoline");
  if (page.data.bocce_court) amenities.push("Bocce Court");
  if (page.data.table_tennis) amenities.push("Table Tennis");
  if (page.data.pool_table) amenities.push("Pool Table");
  if (page.data.tennis_court) amenities.push("Tennis Court");
  if (page.data.fitness_equipment) amenities.push("Fitness Equipment");
  if (page.data.bicycles) amenities.push("Bicycles");
  if (page.data.game_consoles) amenities.push("Game Consoles");
  if (page.data.bluetooth_speakers) amenities.push("Bluetooth Speakers");
  if (page.data.satellite_cable) amenities.push("Satellite Cable");
  if (page.data.smart_tv) amenities.push("Smart TV");
  if (page.data.streaming_service) amenities.push("Streaming Service");
  if (page.data.free_wifi) amenities.push("WiFi");
  if (page.data.fully_airconditioned) amenities.push("Fully Air Conditioning");
  if (page.data.partly_airconditioned)
    amenities.push("Partly Air Conditioning");
  if (page.data.heating) amenities.push("Heating");
  if (page.data.safe) amenities.push("Safe");
  if (page.data.game_room) amenities.push("Game Room");
  if (page.data.fitness_room) amenities.push("Fitness Room");
  if (page.data.dishes_and_utensils) amenities.push("Dishes and Utensils");
  if (page.data.dishwasher) amenities.push("Dishwasher");
  if (page.data.microwave) amenities.push("Microvawe");
  if (page.data.stove) amenities.push("Stove");
  if (page.data.oven) amenities.push("Oven");
  if (page.data.refrigerator) amenities.push("Refrigerator");
  if (page.data.freezer) amenities.push("Freezer");
  if (page.data.coffee_maker) amenities.push("Coffee Maker");
  if (page.data.kettle) amenities.push("Kettle");
  if (page.data.toaster) amenities.push("Toaster");
  if (page.data.highchair) amenities.push("Highchair");
  if (page.data.kingsize_bed) amenities.push("King Size Bed");
  if (page.data.queensize_bed) amenities.push("Queen Size Bed");
  if (page.data.single_bed) amenities.push("Single Bed");
  if (page.data.baby_bed) amenities.push("Baby Bed");
  if (page.data.workplace) amenities.push("Workplace");
  if (page.data.linens_provided) amenities.push("Linens Provided");
  if (page.data.towels_provided) amenities.push("Towels Provided");
  if (page.data.pool_towels_provided) amenities.push("Pool Towels Provided");
  if (page.data.shower) amenities.push("Shower");
  if (page.data.bathtub) amenities.push("Bathtub");
  if (page.data.washing_machine) amenities.push("Washing Machine");
  if (page.data.dryer) amenities.push("Dryer");
  if (page.data.iron_and_board) amenities.push("Iron and Board");
  if (page.data.private_buoy_for_the_boat)
    amenities.push("Private Buoy for the Boat");
  if (page.data.private_sub_boards) amenities.push("Private Sub Boards");
  if (page.data.beach_access) amenities.push("Beach Access");

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
              <PrismicRichText
                field={page.data.content}
                components={rtfComponents}
              />
              {/* DISTANCES */}
              <Distances distances={page.data.distances} />
              {/* AMENITIES */}
              <Amenities amenities={amenities} />

              <div className="w-full leading-[0] border-0 mt-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23170.360407531967!2d16.89009298267886!3d43.45443700463057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134abff56a0e93b9%3A0xafb89b85d0dcc92d!2s%C5%A0estanovac!5e0!3m2!1sen!2shr!4v1718792713508!5m2!1sen!2shr"
                  style={{ border: "0" }}
                  className="w-full h-[500px]"
                  allowFullScreen
                ></iframe>
              </div>

              {/* GALLERY */}
              <PhotoGallery photos={photos} heading="Gallery" />
            </div>

            <div className="lg:w-1/3 md:w-1/2 md:p-4 px-3 mt-8 md:mt-0">
              <div className="sticky top-20">
                <div className="rounded-md bg-slate-50 dark:bg-slate-800 shadow dark:shadow-gray-700">
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
                    {/* <div className="p-1 w-1/2">
                      <Link
                        href="#"
                        className="btn bg-green-600 hover:bg-green-700 text-white rounded-md w-full"
                      >
                        Offer Now
                      </Link>
                    </div> */}
                  </div>
                </div>

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
    .getByUID("accommodation_single", params.uid)
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("accommodation_single");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
