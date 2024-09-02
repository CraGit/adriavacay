"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Lightbox from "react-18-image-lightbox";

import { FiCamera } from "@/assets/icons/vander";

import "react-18-image-lightbox/style.css";

export default function PropertyImage({ photos }) {
  let [isOpen, setIsOpen] = useState(false);

  let [photoIndex, setActiveIndex] = useState(0);

  let handleCLick = (index) => {
    setActiveIndex(index);
    setIsOpen(true);
  };
  return (
    <div className="md:flex mt-4">
      <div className="lg:w-1/2 md:w-1/2 p-1">
        <div className="group relative overflow-hidden">
          <Image
            src={photos[0].src}
            alt={photos[0].alt || "property photo"}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            priority
          />
          <div className="absolute inset-0 group-hover:bg-slate-900/70 duration-500 ease-in-out"></div>
          <div className="absolute top-1/2 -translate-y-1/2 start-0 end-0 text-center invisible group-hover:visible">
            <Link
              href="#"
              onClick={() => handleCLick(0)}
              className="btn btn-icon bg-green-600 hover:bg-green-700 text-white rounded-full lightbox"
            >
              <FiCamera width={18} />
            </Link>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 md:w-1/2">
        <div className="flex">
          <div className="w-1/2 p-1">
            <div className="group relative overflow-hidden">
              <Image
                src={photos[1].src || photos[0].src}
                alt={photos[1].alt || "property photo"}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                priority
              />
              <div className="absolute inset-0 group-hover:bg-slate-900/70 duration-500 ease-in-out"></div>
              <div className="absolute top-1/2 -translate-y-1/2 start-0 end-0 text-center invisible group-hover:visible">
                <Link
                  href="#"
                  onClick={() => handleCLick(1)}
                  className="btn btn-icon bg-green-600 hover:bg-green-700 text-white rounded-full lightbox"
                >
                  <FiCamera width={18} />
                </Link>
              </div>
            </div>
          </div>

          <div className="w-1/2 p-1">
            <div className="group relative overflow-hidden">
              <Image
                src={photos[2].src || photos[0].src}
                alt={photos[2].alt || "property photo"}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                priority
              />
              <div className="absolute inset-0 group-hover:bg-slate-900/70 duration-500 ease-in-out"></div>
              <div className="absolute top-1/2 -translate-y-1/2 start-0 end-0 text-center invisible group-hover:visible">
                <Link
                  href="#"
                  onClick={() => handleCLick(2)}
                  className="btn btn-icon bg-green-600 hover:bg-green-700 text-white rounded-full lightbox"
                >
                  <FiCamera width={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="w-1/2 p-1">
            <div className="group relative overflow-hidden">
              <Image
                src={photos[3].src || photos[0].src}
                alt={photos[3].alt || "property photo"}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                priority
              />
              <div className="absolute inset-0 group-hover:bg-slate-900/70 duration-500 ease-in-out"></div>
              <div className="absolute top-1/2 -translate-y-1/2 start-0 end-0 text-center invisible group-hover:visible">
                <Link
                  href="#"
                  onClick={() => handleCLick(3)}
                  className="btn btn-icon bg-green-600 hover:bg-green-700 text-white rounded-full lightbox"
                >
                  <FiCamera width={18} />
                </Link>
              </div>
            </div>
          </div>

          <div className="w-1/2 p-1">
            <div className="group relative overflow-hidden">
              <Image
                src={photos[4].src || photos[0].src}
                alt={photos[4].alt || "property photo"}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                priority
              />
              <div className="absolute inset-0 group-hover:bg-slate-900/70 duration-500 ease-in-out"></div>
              <div className="absolute top-1/2 -translate-y-1/2 start-0 end-0 text-center invisible group-hover:visible">
                <Link
                  href="#"
                  onClick={() => handleCLick(4)}
                  className="btn btn-icon bg-green-600 hover:bg-green-700 text-white rounded-full lightbox"
                >
                  <FiCamera width={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <Lightbox
          mainSrc={photos[photoIndex].src}
          nextSrc={photos[(photoIndex + 1) % photos.length].src}
          prevSrc={photos[(photoIndex + photos.length - 1) % photos.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setActiveIndex((photoIndex + photos.length - 1) % photos.length)
          }
          onMoveNextRequest={() =>
            setActiveIndex((photoIndex + 1) % photos.length)
          }
          imageCaption={photos[photoIndex].alt}
        />
      )}
    </div>
  );
}
