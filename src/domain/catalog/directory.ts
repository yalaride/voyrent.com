export const MAKE_DIRECTORY = [
  { slug: "mercedes-benz", name: "Mercedes-Benz" },
  { slug: "range-rover", name: "Range Rover" },
  { slug: "chevrolet", name: "Chevrolet" },
  { slug: "hyundai", name: "Hyundai" },
  { slug: "nissan", name: "Nissan" },
  { slug: "toyota", name: "Toyota" },
  { slug: "porsche", name: "Porsche" },
  { slug: "ford", name: "Ford" },
  { slug: "kia", name: "Kia" },
  { slug: "bmw", name: "BMW" },
] as const;

const MAKES_BY_LENGTH = [...MAKE_DIRECTORY].sort((left, right) => right.slug.length - left.slug.length);

export function pathToken(name: string): string {
  return name.trim().replace(/\s+/g, "-");
}

export function makeFromToken(token: string) {
  const normalized = token.trim().toLowerCase();
  return MAKE_DIRECTORY.find((make) => make.slug === normalized || pathToken(make.name).toLowerCase() === normalized);
}

export function makeBySlug(slug: string) {
  return MAKE_DIRECTORY.find((make) => make.slug === slug);
}

export function makePrefix(value: string) {
  return MAKES_BY_LENGTH.find((make) => value === make.slug || value.startsWith(`${make.slug}-`));
}

export function makeFromKeyword(keyword: string) {
  const normalized = keyword.trim().toLowerCase();
  return MAKE_DIRECTORY.find(
    (make) => make.slug === normalized || make.name.toLowerCase() === normalized,
  );
}
