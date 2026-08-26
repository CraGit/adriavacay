"use client";

import { useEffect, useState } from "react";
import { useQueryState } from "nuqs";

import Card from "@/components/Card";
import { formatStayDateISO } from "@/lib/stay-dates";
import { filterAccommodationsWithValidPricing } from "@/lib/validation";
import { useSearch } from "@/providers/search-provider";

function getMyRentId(item) {
  const raw = item.myRentId ?? item.data?.myRentID;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export const AccommodationSingle = ({ accommodations, showAll }) => {
  const [type, setType] = useQueryState("type", {
    defaultValue: "All",
  });
  const { query } = useSearch();

  const from = query?.dateRange?.from ?? null;
  const to = query?.dateRange?.to ?? null;
  const hasDates = from != null && to != null;

  const [freeByObjectId, setFreeByObjectId] = useState(null);
  const [freeStatus, setFreeStatus] = useState(hasDates ? "loading" : "idle");

  useEffect(() => {
    query.type !== type && query.type !== "All" && setType(query.type);
  }, []);

  useEffect(() => {
    if (!hasDates) {
      setFreeByObjectId(null);
      setFreeStatus("idle");
      return;
    }

    const fromIso = formatStayDateISO(from);
    const toIso = formatStayDateISO(to);
    if (!fromIso || !toIso) {
      setFreeByObjectId(null);
      setFreeStatus("error");
      return;
    }

    const controller = new AbortController();
    setFreeStatus("loading");
    setFreeByObjectId(null);

    const params = new URLSearchParams({ from: fromIso, to: toIso });
    if (query.guests) params.set("guests", String(query.guests));

    fetch(`/api/myrent/free?${params}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Free search failed (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        const map = new Map();
        for (const row of data.properties || []) {
          map.set(Number(row.objectId), row);
        }
        setFreeByObjectId(map);
        setFreeStatus("ready");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("[AccommodationSingle] free search", err);
        setFreeByObjectId(null);
        setFreeStatus("error");
      });

    return () => controller.abort();
  }, [hasDates, from, to, query.guests]);

  if (showAll) {
    return renderAllAccommodations(accommodations, type);
  }

  let filtered = accommodations.filter((item) =>
    type === "All" ? true : item.data.type === type
  );

  filtered = filterAccommodationsWithValidPricing(filtered);

  if (query?.guests) {
    filtered = filtered.filter((item) => item.data.max_guests >= query.guests);
  }

  if (hasDates) {
    if (freeStatus === "loading" || freeStatus === "idle") {
      return <p className="text-slate-500">Searching availability…</p>;
    }
    if (freeStatus === "error" || !freeByObjectId) {
      return (
        <p className="text-slate-500">
          Unable to search availability right now. Please try again.
        </p>
      );
    }

    filtered = filtered.filter((item) => {
      const id = getMyRentId(item);
      return id != null && freeByObjectId.has(id);
    });

    return renderFreeSearchResults(filtered, freeByObjectId);
  }

  return renderAllAccommodations(filtered, type);
};

function renderFreeSearchResults(accommodations, freeByObjectId) {
  if (accommodations.length === 0) {
    return <p>No results found</p>;
  }

  return accommodations.map((item) => {
    const id = getMyRentId(item);
    const free = freeByObjectId.get(id);
    const price = free?.price > 0 ? free.price : 0;

    return (
      <Card
        key={item.id}
        uid={item.uid}
        baths={item.data.bathrooms}
        bedrooms={item.data.bedrooms}
        basePrice={price || undefined}
        discountedPrice={price || undefined}
        image={item.data.gallery[0].image.url}
        alt={item.data.gallery[0].image}
        sqm={item.data.sqm}
        title={item.data.heading}
        guests={item.data.max_guests}
        guestsPrikaz={item.data.guestsPrikaz}
        type={item.data.type}
        features={item.data.features}
      />
    );
  });
}

function renderAllAccommodations(accommodations, type) {
  let filtered = accommodations.filter((item) =>
    type === "All" ? true : item.data.type === type
  );

  filtered = filterAccommodationsWithValidPricing(filtered);

  return filtered
    .map((item) => {
      let lowestPrice;

      if (item.myRentDays) {
        const prices = Object.values(item.myRentDays)
          .filter((d) => d.available && d.price > 0)
          .map((d) => d.price);
        if (prices.length === 0) {
          // Fall through to Prismic pricing
        } else {
          lowestPrice = Math.floor(Math.min(...prices));
        }
      }

      if (lowestPrice == null) {
        const pricing = item.pricing || item.data?.pricing || [];
        const validPrices = pricing.filter((p) => p.price && p.price > 0);
        if (validPrices.length === 0) {
          // MyRent property without day cache: still show the card
          if (getMyRentId(item)) {
            return (
              <Card
                key={item.id}
                uid={item.uid}
                baths={item.data.bathrooms}
                bedrooms={item.data.bedrooms}
                image={item.data.gallery[0].image.url}
                alt={item.data.gallery[0].image}
                sqm={item.data.sqm}
                title={item.data.heading}
                guests={item.data.max_guests}
                guestsPrikaz={item.data.guestsPrikaz}
                type={item.data.type}
                features={item.data.features}
              />
            );
          }
          return null;
        }
        lowestPrice = Math.floor(Math.min(...validPrices.map((p) => p.price)));
      }

      return (
        <Card
          key={item.id}
          uid={item.uid}
          baths={item.data.bathrooms}
          bedrooms={item.data.bedrooms}
          lowestPrice={lowestPrice}
          image={item.data.gallery[0].image.url}
          alt={item.data.gallery[0].image}
          sqm={item.data.sqm}
          title={item.data.heading}
          guests={item.data.max_guests}
          guestsPrikaz={item.data.guestsPrikaz}
          type={item.data.type}
          features={item.data.features}
        />
      );
    })
    .filter(Boolean);
}
