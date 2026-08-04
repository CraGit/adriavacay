import Hero from "@/components/Hero";

/**
 * @typedef {import("@prismicio/client").Content.HeroSliceSlice} HeroSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<HeroSliceSlice>} HeroSliceProps
 * @param {HeroSliceProps}
 */
const HeroSlice = ({ slice }) => {
  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Hero
        animated={[
          slice.primary.heading_animated_1,
          slice.primary.heading_animated_2,
          slice.primary.heading_animated_3,
        ]}
        start={slice.primary.heading_start}
        end={slice.primary.heading_end}
        backgroundImage={slice.primary.image.url}
        backgroundImageAlt={slice.primary.image}
        description={slice.primary.description}
        buttonText={slice.primary.button_text}
        buttonLink={slice.primary.button_link}
      />
    </div>
  );
};

export default HeroSlice;
