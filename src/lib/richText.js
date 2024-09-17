import { PrismicNextLink } from "@prismicio/next";
const rtfComponents = {
  heading1: ({ children }) => (
    <h1 className="text-4xl font-semibold leading-tight font-display text-slate-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight">
      {children}
    </h1>
  ),
  heading2: ({ children }) => (
    <h2 className="text-3xl font-semibold leading-tight font-display text-slate-900 sm:text-4xl sm:leading-tight lg:text-5xl lg:leading-tight">
      {children}
    </h2>
  ),
  heading3: ({ children }) => (
    <h2 className="text-2xl font-semibold leading-tight font-display text-slate-900 sm:text-3xl sm:leading-tight lg:text-4xl lg:leading-tight">
      {children}
    </h2>
  ),
  paragraph: ({ children }) => (
    <p className="py-4 leading-8 text-lg font-normal text-slate-700">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <span className="font-semibold text-lg tracking-normal leading-10 font-display">
      {children}
    </span>
  ),
  hyperlink: ({ node, children, key }) => (
    <PrismicNextLink
      key={key}
      field={node.data}
      className="text-green-600 hover:text-gray-600 font-medium underline decoration-dotted underline-offset-2"
    >
      {children}
    </PrismicNextLink>
  ),
};

export default rtfComponents;
