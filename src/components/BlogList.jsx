import BlogCard from "./BlogCard";

export default function BlogList({ blogs }) {
  return (
    <section className="relative md:py-24 py-16">
      <div className="container">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px]">
          {blogs.map((item) => (
            <BlogCard
              uid={item.uid}
              url={item.url}
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
