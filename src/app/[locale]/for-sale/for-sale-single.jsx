"use client";

import CardForSale from "./CardForSale";

export const ForSaleSingle = ({ villas }) => {
  return villas.map((item) => (
    <CardForSale
      key={item.id}
      uid={item.uid}
      baths={item.data.bathrooms}
      bedrooms={item.data.bedrooms}
      price={item.data.price}
      image={item.data.gallery[0].image.url}
      alt={item.data.gallery[0].image.alt}
      sqm={item.data.sqm}
      title={item.data.heading}
      guestsPrikaz={item.data.guestsPrikaz}
    />
  ));
};
