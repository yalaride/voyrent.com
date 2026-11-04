/** @type {import('tailwindcss').Config} */

const space = [0, 4, 6, 8, 10, 12, 16, 20, 24, 30, 40, 80];
const radius = [4, 8, 12, 16, 24, 999];
const textStyles = [
  "title",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "body-large",
  "body",
  "body-lite",
  "body-small",
  "body-small-lite",
  "caption",
];

const v = (name: string) => `var(--${name})`;

const config = {
  // Matches your tsconfig path setup (@/* -> ./src/*)
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: v("color-primary"),
        success: v("color-success"),
        warning: v("color-warning"),
        danger: v("color-danger"),
        info: v("color-info"),
        link: v("color-link"),
        "text-primary": v("color-text-primary"),
        "text-secondary": v("color-text-secondary"),
        "text-inverse": v("color-text-inverse"),
        "text-disabled": v("color-text-disabled"),
        "border-subtle": v("color-border-subtle"),
        "border-default": v("color-border-default"),
        "background-primary": v("color-background-primary"),
        "background-secondary": v("color-background-secondary"),
        "background-section": v("color-background-section"),
      },
      spacing: {
        ...Object.fromEntries(
          space.map((n) => [`space-${n}`, v(`spacing-space-${n}`)]),
        ),
        "dim-40": v("spacing-dim-40"),
        "dim-44": v("spacing-dim-44"),
        "dim-48": v("spacing-dim-48"),
      },
      maxWidth: {
        1440: v("container-1440"),
      },
      borderRadius: Object.fromEntries(
        radius.map((n) => [String(n), v(`radius-${n}`)]),
      ),
      boxShadow: {
        small: v("shadow-small"),
        medium: v("shadow-medium"),
        large: v("shadow-large"),
        spread: v("shadow-spread"),
      },
      fontSize: Object.fromEntries(
        textStyles.map((s) => [
          s,
          [
            v(`text-${s}`),
            {
              lineHeight: v(`text-${s}--line-height`),
              fontWeight: v(`text-${s}--font-weight`),
              ...(/^(title|h\d)$/.test(s) && { letterSpacing: "-0.02em" }),
            },
          ],
        ]),
      ),
    },
  },
  plugins: [],
};

export default config;
