import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";

import {
  GoPeople,
  LiaCompressArrowsAltSolid,
  LuBath,
  LuBedDouble,
} from "@/assets/icons/vander";
import { currency } from "@/lib/utils";

export default function Card({
  uid,
  image,
  title,
  sqm,
  bedrooms,
  baths,
  basePrice,
  discountedPrice,
  lowestPrice,
  alt,
  guestsPrikaz,
  type,
}) {
  const t = useTranslations("card");
  const tSearch = useTranslations("search");

  return (
    <div className="group rounded-xl bg-white dark:bg-slate-900 shadow hover:shadow-xl dark:hover:shadow-xl dark:shadow-gray-700 dark:hover:shadow-gray-700 overflow-hidden ease-in-out duration-500">
      <Link
        href={`/accommodation/${uid}`}
        className="text-lg hover:text-green-600 font-medium ease-in-out duration-500 hover:cursor-pointer"
      >
        <div className="relative">
          <div className="absolute top-4 end-4 bg-green-600 text-white dark:text-slate-900 dark:bg-green-600 px-2 py-1 rounded-full text-sm font-medium">
            {tSearch(type.toLowerCase())}
          </div>
          <Image
            src={image}
            alt={alt}
            width={0}
            height={0}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ width: "100%", height: "250px" }}
          />

          {/* <div className="absolute top-4 end-4">
          <Link
            href="#"
            className="btn btn-icon bg-white dark:bg-slate-900 shadow dark:shadow-gray-700 rounded-full text-slate-100 dark:text-slate-700 focus:text-red-600 dark:focus:text-red-600 hover:text-red-600 dark:hover:text-red-600"
          >
            <i className="mdi mdi-heart mdi-18px"></i>
          </Link>
        </div> */}
        </div>
      </Link>

      <div className="p-6">
        <div className="pb-6">
          <Link
            href={`/accommodation/${uid}`}
            className="text-lg hover:text-green-600 font-medium ease-in-out duration-500"
          >
            {title}
          </Link>
        </div>

        <ul className="py-6 border-y border-slate-100 dark:border-gray-800 flex items-center list-none">
          <li className="flex items-center me-4">
            <GoPeople width={20} className="me-2 text-green-600" />
            <span>{guestsPrikaz}</span>
          </li>
          <li className="flex items-center me-4">
            <LiaCompressArrowsAltSolid
              width={20}
              className="me-2 text-green-600"
            />
            <span>{sqm}m2</span>
          </li>

          <li className="flex items-center me-4">
            <LuBedDouble width={20} className="me-2 text-green-600" />
            <span>{bedrooms}</span>
          </li>

          <li className="flex items-center">
            <LuBath width={20} className="me-2 text-green-600" />
            <span>{baths}</span>
          </li>
        </ul>

        <ul className="pt-6 flex justify-between items-center list-none">
          <li>
            <span className="text-slate-400">{t("price")}</span>
            <p className="text-lg font-medium">
              {basePrice &&
                basePrice === discountedPrice &&
                currency(basePrice)}
              {basePrice && basePrice !== discountedPrice && (
                <>
                  <span className="line-through text-sm">
                    {currency(basePrice)}
                  </span>
                  <span className="ml-2">{currency(discountedPrice)}</span>
                </>
              )}
              {lowestPrice && `${t("from")} ${currency(lowestPrice)}`}
            </p>
          </li>

          {/* <li>
            <span className="text-slate-400">Rating</span>
            <ul className="text-lg font-medium text-amber-400 list-none">
              <li className="inline ms-1">
                <i className="mdi mdi-star"></i>
              </li>
              <li className="inline ms-1">
                <i className="mdi mdi-star"></i>
              </li>
              <li className="inline ms-1">
                <i className="mdi mdi-star"></i>
              </li>
              <li className="inline ms-1">
                <i className="mdi mdi-star"></i>
              </li>
              <li className="inline ms-1">
                <i className="mdi mdi-star"></i>
              </li>
              <li className="inline ms-1 text-black dark:text-white">
                {item.rating}(30)
              </li>
            </ul>
          </li> */}
        </ul>
      </div>
    </div>
  );
}
