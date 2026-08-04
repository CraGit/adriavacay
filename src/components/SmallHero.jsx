import Image from "next/image";

import { getImageAlt } from "@/lib/image-alt";

export default function SmallHero({ heading, backgroundImage }) {
  return (
    <section className="relative table w-full py-32 lg:py-36">
      <div className="absolute inset-0">
        {backgroundImage?.url && (
          <Image
            fill
            src={backgroundImage.url}
            alt={getImageAlt(backgroundImage, heading)}
            style={{ objectFit: "cover" }}
            sizes="100vw"
            quality={75}
            priority
          />
        )}
      </div>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="container">
        <div className="grid grid-cols-1 text-center mt-10">
          <h1 className="md:text-4xl text-3xl md:leading-normal leading-normal font-medium text-white">
            {heading}
          </h1>
        </div>
      </div>
    </section>
  );
}
