import React from "react";
import Link from "next/link";
import TextAnimation from "./TextAnimation";
import Image from "next/image";
import SearchForm from "./SearchForm";

export default function Hero({
  start,
  animated,
  end,
  backgroundImage,
  description,
  buttonText,
  buttonLink,
}) {
  console.log(backgroundImage);
  return (
    <>
      <section className="relative table w-full py-36 md:py-44 lg:py-56">
        <div className="container z-3">
          <div className="grid md:grid-cols-12 mt-10">
            <div className="lg:col-span-8 md:col-span-6">
              <TextAnimation start={start} animated={animated} end={end} />
              <p className="text-white/70 text-xl max-w-xl">{description}</p>

              <div className="mt-4">
                <Link
                  href={buttonLink}
                  className="btn bg-green-600 hover:bg-green-700 text-white rounded-md mt-3"
                >
                  {buttonText}{" "}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="hero"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="absolute inset-0 bg-black/50"></div>
      </section>
      <section className="relative md:pb-24 pb-16">
        <div className="container">
          <div className="grid grid-cols-1 justify-center">
            <div className="relative -mt-32">
              <div className="grid grid-cols-1">
                <div
                  id="StarterContent"
                  className="p-6 bg-white dark:bg-slate-900  md:rounded-se-xl rounded-xl shadow-md dark:shadow-gray-700"
                >
                  <div
                    id="buy-home"
                    role="tabpanel"
                    aria-labelledby="buy-home-tab"
                  >
                    <SearchForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
