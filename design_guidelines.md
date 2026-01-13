# Design Guidelines: Noise-Canceling Mat Quote Calculator

## Design Approach
**System-Based Approach** - Material Design inspired clean interface
This is a utility-focused quotation tool requiring clarity, efficiency, and trust. We'll use Material Design principles with Korean market sensibilities: clean forms, clear hierarchy, and professional presentation suitable for a retail hardware store application.

## Typography
- **Primary Font**: Noto Sans KR (Korean optimized) via Google Fonts
- **Headings**: 700 weight, sizes: text-2xl (page title), text-xl (section headers), text-lg (subsections)
- **Body**: 400 weight, text-base for form labels and content
- **Accent/Numbers**: 600 weight for prices and measurements

## Layout System
**Tailwind Spacing Units**: 4, 6, 8, 12, 16
- Form spacing: space-y-6 between form sections
- Card padding: p-8
- Section margins: mb-12
- Input fields: h-12 standard height

## Component Structure

### Header
- Store name and logo (left)
- Contact number prominently displayed (right)
- Simple, clean bar with border-b

### Main Calculator Section
**Single-column centered layout** (max-w-3xl mx-auto)

**Input Form Card**:
- Elevated card (shadow-lg) with rounded-xl
- Form fields in logical groups:
  - Room dimensions (width, length inputs with unit indicators)
  - Mat type selection (radio buttons with clear labels)
  - Thickness options (segmented control)
  - Additional options (checkboxes for extras like adhesive, corner pieces)
- Clear visual separation between input groups (border-t, pt-6)
- Inline validation indicators

**Summary/Results Card**:
- Prominent price display (text-4xl, font-bold)
- Breakdown list showing:
  - Area calculation
  - Material cost
  - Additional items
  - Total
- Clear "Request Quote" CTA button (w-full, h-14)

### Footer
- Store information
- Business hours
- Address
- Simple, informative

## Form Design
- **Input Fields**: Outlined style with focus:ring-2, rounded-lg
- **Labels**: Above inputs, text-sm font-medium
- **Radio/Checkboxes**: Large touch targets (min-h-12), clear selected states
- **Dropdowns**: Custom styled with Tailwind, chevron icons
- **Buttons**: 
  - Primary: Solid background, h-12, rounded-lg, font-semibold
  - Secondary: Outlined style

## Information Display
- **Calculation Results**: Grid layout (grid-cols-2) for label-value pairs
- **Price Display**: Large, bold, with KRW formatting (e.g., ₩150,000)
- **Helper Text**: text-sm, subtle color for guidance

## Responsiveness
- Desktop: Two-column form layout where appropriate
- Mobile: Single column stack, full-width inputs
- Breakpoint: md (768px)

## Visual Hierarchy
1. Price/total (largest, most prominent)
2. Form inputs (organized, clear)
3. Supporting information (subtle, accessible)
4. Store details (footer, smaller)

## Icons
**Heroicons** (outline style) for:
- Phone icon (contact)
- Calculator icon (page identifier)
- Check marks (selected options)
- Info icons (tooltips)

## Critical UX Elements
- Real-time calculation updates as users input data
- Clear unit indicators (㎡, cm, etc.)
- Visible calculation formula/breakdown
- Mobile-optimized number inputs for dimensions
- Error states for invalid inputs (border-red-500)

## Images
**No hero image** - This is a functional tool, not marketing page
**Optional**: Small product thumbnail images next to mat type options if available

## Professional Trust Elements
- Store certification/logo if available
- "Trusted by X customers" subtle indicator
- Clear pricing transparency
- Professional form validation messages

This design prioritizes usability, clarity, and trust - essential for a B2B quotation tool in the Korean retail market.