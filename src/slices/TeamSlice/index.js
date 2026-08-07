import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { FiPhone, FiMail } from "react-icons/fi";

/**
 * @typedef {import("@prismicio/client").Content.TeamSliceSlice} TeamSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<TeamSliceSlice>} TeamSliceProps
 * @type {import("react").FC<TeamSliceProps>}
 */
const GOLD = "rgb(172 139 21)";

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
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm"
              >
                {/* Fixed-aspect photo */}
                {member.photo?.url && (
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-100 flex-shrink-0">
                    <PrismicNextImage
                      field={member.photo}
                      fill
                      fallbackAlt={member.name || "Team member"}
                      style={{ objectFit: "cover", objectPosition: "top" }}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={75}
                    />
                  </div>
                )}

                <div className="flex flex-col flex-1 p-6">
                  {/* Name + role */}
                  <div className="mb-3">
                    {member.name && (
                      <h5 className="text-lg font-semibold text-slate-900 dark:text-white leading-snug">
                        {member.name}
                      </h5>
                    )}
                    {member.role && (
                      <p className="text-sm font-medium mt-0.5 italic" style={{ color: GOLD }}>
                        {member.role}
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-slate-100 dark:bg-slate-700 mb-4" />

                  {/* Description — left-aligned, prose-like */}
                  {member.description && member.description.length > 0 && (
                    <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-1 [&_p]:mb-2 [&_strong]:font-semibold [&_strong]:text-slate-800 [&_em]:italic">
                      <PrismicRichText field={member.description} />
                    </div>
                  )}

                  {/* Contact info */}
                  {(member.phone || member.email) && (
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-2">
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-2 text-slate-500 hover:text-[rgb(172_139_21)] text-sm transition-colors duration-300"
                        >
                          <FiPhone className="w-4 h-4 flex-shrink-0" />
                          <span>{member.phone}</span>
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-2 text-slate-500 hover:text-[rgb(172_139_21)] text-sm transition-colors duration-300"
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
