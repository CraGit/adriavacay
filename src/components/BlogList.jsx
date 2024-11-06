"use client";

import { usePathname } from "@/i18n/routing";

import BlogCard from "./BlogCard";

export default function BlogList({ blogs }) {
  const pathname = usePathname();

  const basePath = pathname.includes("destinations") ? "destinations" : "blog";

  return (
    <section className="relative md:py-24 py-16">
      <div className="container">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px]">
          {blogs.map((item) => (
            <BlogCard
              uid={item.uid}
              url={`/${basePath}/${item.uid}`}
              title={item.data.heading}
              image={item.data.image.url}
              key={item.uid}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
