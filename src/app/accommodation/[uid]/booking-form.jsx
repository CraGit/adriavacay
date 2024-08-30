"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { DateRangePicker } from "@/app/components/DateRangePicker";
import { useSearch } from "@/providers/search-provider";
import { cn } from "@/lib/utils";
import { submitBooking } from "@/actions/booking";

export default function BookingForm({ occupiedDates, className }) {
  const { query, updateQuery } = useSearch();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = submitBooking.bind(null, query.dateRange, query.guests);

  return (
    <form action={onSubmit}>
      <div className={cn("rounded-md px-4 py-2 shadow", className)}>
        {/* <h3 className="mb-2 text-lg leading-normal font-medium">Booking Form</h3> */}

        <div className="grid">
          <div className="lg:col-span-6 mb-1">
            <label className="font-medium text-sm">Dates</label>
            <DateRangePicker
              selected={query.dateRange}
              onSelect={(range) => updateQuery({ dateRange: range })}
              className="mt-2"
              disabledDates={occupiedDates}
            />
          </div>

          <div className="lg:col-span-1 mb-1 pr-2">
            <label className="font-medium text-sm">Guests</label>
            <input
              type="text"
              className="form-input mt-1"
              value={query.guests}
              onChange={(e) => updateQuery({ guests: e.target.value })}
            />
          </div>

          <div className="lg:col-span-5 mb-1">
            <label className="font-medium text-sm">Name:</label>
            <input
              name="name"
              type="text"
              className="form-input mt-1"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="lg:col-span-6 mb-1">
            <label className="font-medium text-sm">Email:</label>
            <input
              name="email"
              type="email"
              className="form-input mt-1"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* <div>
            <label className="font-medium text-sm">Your Message</label>
            <textarea
              className="form-input mt-2 textarea w-full"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div> */}
        </div>
      </div>
      <div className="flex mt-6">
        <div className="flex-grow">
          <button
            type="submit"
            className="btn bg-green-600 hover:bg-green-700 text-white rounded-md w-full"
          >
            Book Now
          </button>
        </div>
      </div>
    </form>
  );
}
