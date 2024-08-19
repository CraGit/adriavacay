export default function SectionHeading({ heading, subheading }) {
  return (
    <div className="grid grid-cols-1 text-center container">
      <h3 className="mb-4 md:text-3xl md:leading-normal text-2xl leading-normal font-semibold">
        {heading}
      </h3>

      <p className="text-slate-400 text-left md:text-center">{subheading}</p>
    </div>
  );
}
