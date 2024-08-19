import SmallHero from "@/app/components/SmallHero";

/**
 * @typedef {import("@prismicio/client").Content.SmallHeroSliceSlice} SmallHeroSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<SmallHeroSliceSlice>} SmallHeroSliceProps
 * @param {SmallHeroSliceProps}
 */
const SmallHeroSlice = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <SmallHero
        heading={slice.primary.heading}
        backgroundImage={slice.primary.image}
      />
    </section>
  );
};

export default SmallHeroSlice;
