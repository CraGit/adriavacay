import { PrismicNextLink } from "@prismicio/next";

const rtfComponents = {
  heading1: ({ children }) => (
    <h1 className="text-3xl md:text-4xl font-bold leading-tight text-slate-900 mt-10 mb-4 first:mt-0">
      {children}
    </h1>
  ),
  heading2: ({ children }) => (
    <h2 className="text-2xl md:text-3xl font-bold leading-tight text-slate-900 mt-10 mb-3">
      {children}
    </h2>
  ),
  heading3: ({ children }) => (
    <h3 className="text-xl md:text-2xl font-semibold leading-snug text-slate-900 mt-8 mb-2">
      {children}
    </h3>
  ),
  heading4: ({ children }) => (
    <h4 className="text-lg md:text-xl font-semibold text-slate-900 mt-6 mb-2">
      {children}
    </h4>
  ),
  paragraph: ({ children }) => (
    <p className="text-base md:text-lg leading-8 text-slate-600 mb-5">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-800">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-slate-700">{children}</em>
  ),
  listItem: ({ children }) => (
    <li className="text-base md:text-lg leading-8 text-slate-600 pl-1">{children}</li>
  ),
  oListItem: ({ children }) => (
    <li className="text-base md:text-lg leading-8 text-slate-600 pl-1">{children}</li>
  ),
  list: ({ children }) => (
    <ul className="list-disc list-outside pl-6 mb-5 space-y-1">{children}</ul>
  ),
  oList: ({ children }) => (
    <ol className="list-decimal list-outside pl-6 mb-5 space-y-1">{children}</ol>
  ),
  image: ({ node }) =>
    node.url ? (
      <figure className="my-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={node.url}
          alt={node.alt || ""}
          className="rounded-xl w-full object-cover shadow-sm"
        />
        {node.alt && (
          <figcaption className="text-center text-sm text-slate-400 mt-2">
            {node.alt}
          </figcaption>
        )}
      </figure>
    ) : null,
  hyperlink: ({ node, children, key }) => (
    <PrismicNextLink
      key={key}
      field={node.data}
      className="text-green-600 hover:text-green-700 font-medium underline decoration-dotted underline-offset-2"
    >
      {children}
    </PrismicNextLink>
  ),
  preformatted: ({ children }) => (
    <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 my-5 overflow-x-auto text-sm text-slate-700 leading-7">
      <code>{children}</code>
    </pre>
  ),
};

export default rtfComponents;
