"use client";

import Link from "next/link";
import { PrismicRichText } from "@prismicio/react";

import { submit } from "@/actions/contact";

import { FiHexagon, FiMail, FiMapPin, FiPhone } from "../assets/icons/vander";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ContactForm({
  heading,
  companyDetails,
  phone,
  email,
  address,
}) {
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await submit(formData);

    if (result?.errors) {
      setErrors(result.errors);
    }
  };

  return (
    <section className="relative lg:py-24 py-16">
      <div className="container">
        <div className="grid md:grid-cols-12 grid-cols-1 items-center gap-[30px]">
          <div className="lg:col-span-5 md:col-span-6">
            <div className="lg:me-5">
              <div className="bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-700 p-6">
                <h3 className="mb-6 text-2xl leading-normal font-medium">
                  {heading}
                </h3>

                <form onSubmit={handleSubmit}>
                  <div className="grid lg:grid-cols-12 lg:gap-6">
                    <div className="lg:col-span-6 mb-5">
                      <label htmlFor="name" className="font-medium">
                        Name:
                      </label>
                      <input
                        name="name"
                        type="text"
                        className={cn(
                          "form-input mt-2",
                          errors.name && "border-red-600"
                        )}
                        placeholder="Name :"
                      />
                      {errors.name && (
                        <span className="text-xs">{errors.name[0]}</span>
                      )}
                    </div>

                    <div className="lg:col-span-6 mb-5">
                      <label htmlFor="email" className="font-medium">
                        Email:
                      </label>
                      <input
                        name="email"
                        type="email"
                        className={cn(
                          "form-input mt-2",
                          errors.email && "border-red-600"
                        )}
                        placeholder="Email :"
                      />
                      {errors.email && (
                        <span className="text-xs">{errors.email[0]}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1">
                    <div className="mb-5">
                      <label htmlFor="subject" className="font-medium">
                        Subject:
                      </label>
                      <input
                        name="subject"
                        className={cn(
                          "form-input mt-2",
                          errors.subject && "border-red-600"
                        )}
                        placeholder="Subject :"
                      />
                      {errors.subject && (
                        <span className="text-xs">{errors.subject[0]}</span>
                      )}
                    </div>

                    <div className="mb-5">
                      <label htmlFor="comments" className="font-medium">
                        Your Message:
                      </label>
                      <textarea
                        name="message"
                        className={cn(
                          "form-input mt-2 textarea",
                          errors.message && "border-red-600"
                        )}
                        placeholder="Message :"
                      ></textarea>
                      {errors.message && (
                        <span className="text-xs">{errors.message[0]}</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    id="submit"
                    name="send"
                    className="btn bg-green-600 hover:bg-green-700 text-white rounded-md"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 md:col-span-6">
            <PrismicRichText field={companyDetails} />
          </div>
        </div>
      </div>

      <div className="container lg:mt-24 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-[30px]">
          <div className="text-center px-6">
            <div className="relative overflow-hidden text-transparent -m-3">
              <FiHexagon className="h-32 w-32 fill-green-600/5 mx-auto" />
              <div className="absolute top-2/4 -translate-y-2/4 start-0 end-0 mx-auto text-green-600 rounded-xl transition-all duration-500 ease-in-out text-4xl flex align-middle justify-center items-center">
                <FiPhone width={30} height={30} />
              </div>
            </div>

            <div className="content mt-7">
              <h5 className="title h5 text-xl font-medium">Phone</h5>

              <div className="mt-5">
                <Link
                  href={`tel:${phone}`}
                  className="btn btn-link text-green-600 hover:text-green-600 after:bg-green-600 transition duration-500"
                >
                  {phone}
                </Link>
              </div>
            </div>
          </div>
          <div className="text-center px-6">
            <div className="relative overflow-hidden text-transparent -m-3">
              <FiHexagon className="h-32 w-32 fill-green-600/5 mx-auto" />
              <div className="absolute top-2/4 -translate-y-2/4 start-0 end-0 mx-auto text-green-600 rounded-xl transition-all duration-500 ease-in-out text-4xl flex align-middle justify-center items-center">
                <FiMail width={30} height={30} />
              </div>
            </div>

            <div className="content mt-7">
              <h5 className="title h5 text-xl font-medium">E-mail</h5>

              <div className="mt-5">
                <Link
                  href={`mailto:${email}`}
                  className="btn btn-link text-green-600 hover:text-green-600 after:bg-green-600 transition duration-500"
                >
                  {email}
                </Link>
              </div>
            </div>
          </div>
          <div className="text-center px-6">
            <div className="relative overflow-hidden text-transparent -m-3">
              <FiHexagon className="h-32 w-32 fill-green-600/5 mx-auto" />
              <div className="absolute top-2/4 -translate-y-2/4 start-0 end-0 mx-auto text-green-600 rounded-xl transition-all duration-500 ease-in-out text-4xl flex align-middle justify-center items-center">
                <FiMapPin width={30} height={30} />
              </div>
            </div>

            <div className="content mt-7">
              <h5 className="title h5 text-xl font-medium">Address</h5>

              <div className="mt-5">
                <p className="btn btn-link text-green-600 hover:text-green-600 after:bg-green-600 transition duration-500">
                  {address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
