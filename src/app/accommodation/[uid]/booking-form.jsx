"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { DateRangePicker } from "@/app/components/DateRangePicker";
import { useSearch } from "@/providers/search-provider";
import { cn } from "@/lib/utils";

export default function BookingForm({ className }) {
  const { query, updateQuery } = useSearch();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className={cn("rounded-md p-6 shadow", className)}>
      <h3 className="mb-6 text-2xl leading-normal font-medium">Booking Form</h3>

      <form>
        <div className="grid">
          <div className="lg:col-span-6 mb-5">
            <label className="font-medium">Dates</label>
            <DateRangePicker
              selected={query.dateRange}
              onSelect={(range) => updateQuery({ dateRange: range })}
              className="mt-2"
            />
          </div>

          <div className="lg:col-span-6 mb-5">
            <label className="font-medium">Number of guests</label>
            <input
              type="text"
              className="form-input mt-2"
              value={query.guests}
              onChange={(e) => updateQuery({ guests: e.target.value })}
            />
          </div>

          <div className="lg:col-span-6 mb-5">
            <label className="font-medium">Name:</label>
            <input
              type="text"
              className="form-input mt-2"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="lg:col-span-6 mb-5">
            <label className="font-medium">Email:</label>
            <input
              type="email"
              className="form-input mt-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium">Your Message</label>
            <textarea
              className="form-input mt-2 textarea w-full"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  );
}
