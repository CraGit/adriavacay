"use client";

import { hasOverlap } from "@/lib/utils";
import { useSearch } from "@/providers/search-provider";

import Card from "./Card";

export default function CardGrid({ cardDetails, limit = "No limit" }) {
  const { query } = useSearch();

  /*const filterByCategory = cardDetails.filter(
    (card) => card.data.category === query.category
  );*/

  const filterByPeople = cardDetails.filter(
    (card) => card.data.max_guests >= query.guests
  );

  const filterByDate = filterByPeople.filter(
    (card) => !hasOverlap(query.dateRange, card.occupiedDates)
  );

  return (
    <section className="relative lg:py-16 py-8">
      <div className="container">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px]">
          {filterByDate
            .slice(0, limit !== "No limit" ? parseInt(limit) : undefined)
            .map((item) => (
              <Card
                key={item.id}
                uid={item.uid}
                baths={item.data.bathrooms}
                bedrooms={item.data.bedrooms}
                lowestPrice="300"
                image={item.data.gallery[0].image.url}
                alt={item.data.gallery[0].image.alt}
                sqm={item.data.sqm}
                title={item.data.heading}
                guestsPrikaz={item.data.guestsPrikaz}
                guests={item.data.max_guests}
                type={item.data.type}
              />
            ))}
        </div>
        {/* PAGINATION */}
        {/* <div className="grid md:grid-cols-12 grid-cols-1 mt-8">
          <div className="md:col-span-12 text-center">
            <nav>
              <ul className="inline-flex items-center -space-x-px">
                <li>
                  <Link
                    href="#"
                    className="w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white dark:bg-slate-900 hover:text-white shadow-sm dark:shadow-gray-700 hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600"
                  >
                    <FiChevronLeft className="text-[20px]" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 hover:text-white bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600"
                  >
                    1
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 hover:text-white bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600"
                  >
                    2
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    aria-current="page"
                    className="z-10 w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-white bg-green-600 shadow-sm dark:shadow-gray-700"
                  >
                    3
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 hover:text-white bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600"
                  >
                    4
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white dark:bg-slate-900 hover:text-white shadow-sm dark:shadow-gray-700 hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600"
                  >
                    <FiChevronRight className="text-[20px]" />
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div> */}
      </div>
    </section>
  );
}
