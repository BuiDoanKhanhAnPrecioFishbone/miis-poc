# Lovable.dev implementation prompt - Medlingsinstitutet design system

Update the existing app so its visual system follows the Medlingsinstitutet identity, while keeping the existing information architecture and application logic unless explicitly changed below.

## Source of truth
Use `design-tokens.json` and `mi-design-system.css` in this package as the implementation source of truth. Create reusable components and avoid page-specific styling.

## Brand direction
- Calm, authoritative Swedish public-sector expression.
- Generous whitespace, strong editorial hierarchy, high legibility.
- Core palette: deep blue-grey/slate + warm sand + off-white paper.
- Avoid decorative gradients, glassmorphism, excessive shadows and rounded "SaaS" styling.
- Use photography and statistical graphics as content, not decoration.

## Typography
- Until the customer supplies/validates the exact licensed MI brand font, use Arial/Helvetica as the safe fallback.
- Keep headings restrained: medium weight, tight tracking, large editorial scale.
- Body text 18px desktop / 16px minimum mobile, line-height 1.55-1.7.
- Never use text smaller than 14px for functional UI.

## Components to implement
1. Header: official logo area, primary navigation, search, language/utility navigation.
2. Hero/editorial intro: kicker, H1, lead, optional CTA.
3. Buttons: primary, secondary, accent, text-link; all with visible hover/focus/disabled states.
4. Cards: article/news, publication, statistic/KPI, contact/person, download.
5. Forms: labels above fields, help/error text, 48px minimum control height.
6. Accordion/FAQ with keyboard support and explicit open/closed affordance.
7. Tables with horizontal overflow on small screens and accessible headers.
8. Alert/status blocks: info, success, warning, error.
9. Footer: contact details, utility links and external channels.
10. Statistical data visualizations should use the slate scale first; sand is the comparison/highlight color.

## Accessibility
Target WCAG 2.2 AA. Preserve semantic HTML, keyboard navigation, skip link, focus-visible styles, sufficient contrast, 44x44px minimum pointer targets, descriptive link labels, correct heading order, form error association and reduced-motion support.

## Logo
Do not redraw, reinterpret or AI-generate the official Medlingsinstitutet logo. Use the customer's official supplied SVG/PNG unchanged. Prepare these placements from the same master asset:
- horizontal/full logo
- compact mark for constrained UI only if an official mark exists
- dark-on-light
- light-on-dark only if officially approved
- favicon/app icon only from an officially approved symbol
Maintain clear space of at least the height of the capital M around the logo unless the customer's brand guide specifies otherwise.

## Responsive behavior
Mobile-first. Content max-width 760px; wide sections max-width 1200px. Use 16px side padding mobile, 24-32px tablet, 40-64px desktop.

## Acceptance criteria
- No hard-coded colors outside tokens.
- No ad-hoc font sizes outside the type scale.
- All interactive components have default/hover/focus/active/disabled states.
- Lighthouse accessibility issues are treated as defects.
- Existing app functionality and routes remain intact.
