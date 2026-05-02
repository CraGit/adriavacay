import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { FiPhone, FiMail } from "react-icons/fi";

/**
 * @typedef {import("@prismicio/client").Content.TeamSliceSlice} TeamSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<TeamSliceSlice>} TeamSliceProps
 * @type {import("react").FC<TeamSliceProps>}
 */
const TeamSlice = ({ slice }) => {
  const { heading, subheading, members } = slice.primary;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-16 md:py-24"
    >
      <div className="container">
        {/* Section heading */}
        {(heading || subheading) && (
          <div className="grid grid-cols-1 text-center mb-12">
            {heading && (
              <h3 className="mb-4 md:text-3xl md:leading-normal text-2xl leading-normal font-semibold">
                {heading}
              </h3>
            )}
            {subheading && (
              <p className="text-slate-400 md:text-center">{subheading}</p>
            )}
          </div>
        )}

        {/* Team grid — centered regardless of count */}
        {members && members.length > 0 && (
          <div className="flex flex-wrap justify-center gap-8">
            {members.map((member, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-xl shadow dark:shadow-gray-700 hover:-mt-[5px] transition-all duration-500 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm"
              >
                {/* Full-size photo */}
                {member.photo?.url && (
                  <div className="overflow-hidden">
                    <PrismicNextImage
                      field={member.photo}
                      width={member.photo.dimensions?.width}
                      height={member.photo.dimensions?.height}
                      style={{ width: "100%", height: "auto" }}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={75}
                    />
                  </div>
                )}

                <div className="p-6 text-center">
                  {/* Name */}
                  {member.name && (
                    <h5 className="text-xl font-medium">
                      {member.name}
                    </h5>
                  )}

                  {/* Role */}
                  {member.role && (
                    <p className="text-green-600 text-sm font-medium mt-1">
                      {member.role}
                    </p>
                  )}

                  {/* Description */}
                  {member.description && member.description.length > 0 && (
                    <div className="text-slate-400 text-sm mt-3">
                      <PrismicRichText field={member.description} />
                    </div>
                  )}

                  {/* Contact info */}
                  {(member.phone || member.email) && (
                    <div className="mt-4 flex flex-col gap-2 items-center">
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-2 text-slate-400 hover:text-green-600 text-sm transition-all duration-500"
                        >
                          <FiPhone className="w-4 h-4 flex-shrink-0" />
                          <span>{member.phone}</span>
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-2 text-slate-400 hover:text-green-600 text-sm transition-all duration-500"
                        >
                          <FiMail className="w-4 h-4 flex-shrink-0" />
                          <span>{member.email}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSlice;
