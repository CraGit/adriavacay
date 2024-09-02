import Image from "next/image";
import Link from "next/link";

import { FiArrowRight } from "@/assets/icons/vander";

export default function BlogCard({ image, uid, title }) {
  return (
    <div
      key={uid}
      className="group relative h-fit hover:-mt-[5px] overflow-hidden bg-white dark:bg-slate-900 rounded-xl shadow dark:shadow-gray-700 transition-all duration-500"
    >
      <div className="relative overflow-hidden">
        <Image
          src={image}
          className=""
          width={0}
          height={0}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ width: "100%", height: "250px" }}
        />
        <div className="absolute end-4 top-4">
          {/* <span className="bg-green-600 text-white text-[14px] px-2.5 py-1 font-medium rounded-full h-5">
            {item.type}
          </span> */}
        </div>
      </div>

      <div className="relative p-6">
        <div className="">
          {/* <div className="flex justify-between mb-4">
            <span className="text-slate-400 text-sm flex items-center">
              <FiCalendar className="text-slate-900 dark:text-white me-2" />
              <span>{item.date}</span>
            </span>
            <span className="text-slate-400 text-sm ms-3 flex items-center">
              <FiClock className="text-slate-900 dark:text-white me-2" />
              <span>5 min read</span>
            </span>
          </div> */}

          <Link
            href={`/destinations/${uid}`}
            className="title text-xl font-medium hover:text-green-600 duration-500 ease-in-out"
          >
            {title}
          </Link>

          <div className="mt-3">
            <Link
              href={`/destinations/${uid}`}
              className="btn btn-link hover:text-green-600 after:bg-green-600 duration-500 ease-in-out inline-flex items-center"
            >
              <span>Read More</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
