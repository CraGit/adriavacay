"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Lightbox from "react-18-image-lightbox";

import { FiCamera } from "@/assets/icons/vander";
import { getImageAlt } from "@/lib/image-alt";

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
            alt={getImageAlt(photos[0].alt, "Property photo")}
            width={photos[0].width || 800}
            height={photos[0].height || 600}
            sizes="(min-width:1024px) 50vw, 100vw"
            style={{ width: "100%", height: "auto" }}
            quality={75}
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
                src={photos[1]?.src || photos[0].src}
                alt={getImageAlt(photos[1]?.alt, "Property photo")}
                width={photos[1]?.width || 400}
                height={photos[1]?.height || 300}
                sizes="(min-width:1024px) 25vw, 50vw"
                style={{ width: "100%", height: "auto" }}
                quality={75}
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
                src={photos[2]?.src || photos[0].src}
                alt={getImageAlt(photos[2]?.alt, "Property photo")}
                width={photos[2]?.width || 400}
                height={photos[2]?.height || 300}
                sizes="(min-width:1024px) 25vw, 50vw"
                style={{ width: "100%", height: "auto" }}
                quality={75}
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
                src={photos[3]?.src || photos[0].src}
                alt={getImageAlt(photos[3]?.alt, "Property photo")}
                width={photos[3]?.width || 400}
                height={photos[3]?.height || 300}
                sizes="(min-width:1024px) 25vw, 50vw"
                style={{ width: "100%", height: "auto" }}
                quality={75}
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
                src={photos[4]?.src || photos[0].src}
                alt={getImageAlt(photos[4]?.alt, "Property photo")}
                width={photos[4]?.width || 400}
                height={photos[4]?.height || 300}
                sizes="(min-width:1024px) 25vw, 50vw"
                style={{ width: "100%", height: "auto" }}
                quality={75}
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
