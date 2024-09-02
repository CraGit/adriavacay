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
  paragraph: ({ children }) => (
    <p className="py-4 leading-8 text-lg font-normal text-slate-700">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <span className="font-medium text-lg tracking-normal leading-10 font-display">
      {children}
    </span>
  ),
};

export default rtfComponents;
