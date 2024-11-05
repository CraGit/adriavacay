export async function getLocales(doc, client) {
  const [repository, altDocs] = await Promise.all([
    client.getRepository(),
    doc.alternate_languages.length > 0
      ? client.getAllByIDs(
          doc.alternate_languages.map((altLang) => altLang.id),
          {
            lang: "*",
            fetch: `${doc.type}.__nonexistend-field__`,
          }
        )
      : Promise.resolve([]),
  ]);

  return [doc, ...altDocs].map((page) => {
    const lang = repository?.languages.find((l) => l.id === page.lang);

    return {
      lang: lang?.id || "",
      url: page?.url || "",
      lang_name: lang?.name || "",
    };
  });
}
