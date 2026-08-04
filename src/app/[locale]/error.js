"use client";

import { useEffect } from "react";
import Image from "next/image";

import { Link } from "@/i18n/routing";

import logo from "@/assets/images/logo.svg";
import { useTranslations } from "next-intl";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const t = useTranslations("errors");

  return (
    <section className="relative bg-green-600/5">
      <div className="container-fluid relative">
        <div className="grid grid-cols-1">
          <div className="flex flex-col justify-center md:px-10 py-40 px-4">
            <div className="title-heading text-center my-auto">
              <Image
                src={logo}
                width={200}
                height={200}
                className="mx-auto"
                alt="AdriaVacay"
              />
              <h1 className="mt-3 mb-6 md:text-4xl text-3xl font-bold">
                {t("error")}
              </h1>
              <p className="text-slate-400">{t("error-message")}</p>

              <div className="mt-4">
                <Link
                  href="/"
                  className="btn bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white rounded-md"
                >
                  {t("back-to-home")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
