import ContactForm from "@/components/ContactForm";

/**
 * @typedef {import("@prismicio/client").Content.ContactFormSliceSlice} ContactFormSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ContactFormSliceSlice>} ContactFormSliceProps
 * @param {ContactFormSliceProps}
 */
const ContactFormSlice = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <ContactForm
        heading={slice.primary.heading}
        companyDetails={slice.primary.company_details}
        phone={slice.primary.phone}
        email={slice.primary.email}
        address={slice.primary.address}
      />
    </section>
  );
};

export default ContactFormSlice;
