# SHAREGRID — Intelligent Resource-Sharing Platform

SHAREGRID is a premium, minimal editorial web application engineered for academic, biomedical, and advanced engineering institutions to discover, book, and share underused equipment, specialized cleanrooms, fabrication bays, and compute clusters.

---

## Technical Stack

- **React 19 & TypeScript**: Strict types, modular component hierarchy, responsive layout architecture.
- **Vite 6**: Ultra-fast HMR and production bundling.
- **Tailwind CSS 3**: Custom editorial palette (warm ivory `#FAF7F0`, forest green `#112219`, charcoal `#1A1E1D`, subtle lime `#D2E646`).
- **Typography**: Google Font [Manrope](https://fonts.google.com/specimen/Manrope) with custom typography scales and tabular numeral alignments.
- **Lucide Icons**: Clean, light, non-skeuomorphic iconography.

---

## Core Sections Implemented

1. **Navigation Bar (`Navbar.tsx`)**:
   - Editorial brand emblem and typography.
   - Smooth navigation to `#resources`, `#how-it-works`, `#benefits`, `#trust`.
   - Global `/` search shortcut trigger.
   - "List Facility or Tool" modal trigger.
   - "Institutional Portal" SAML SSO modal trigger.
   - Responsive mobile navigation drawer.

2. **Hero Section (`Hero.tsx`)**:
   - Minimal architectural grid background.
   - Institutional standard tags and authoritative editorial typography.
   - Integrated live resource search.
   - Verified proof metrics ($48.2M+ capital equipment indexed, 88+ partner labs, 99.4% booking fidelity, ISO 17025 standard audit logs).

3. **Resource Search & Filtering (`ResourceSearch.tsx` & `FeaturedResources.tsx`)**:
   - Live query input searching across titles, instrument codes, descriptions, institutions, cities, and technical specifications.
   - Discipline tabs: Scientific Instruments, Precision Fabrication, Cleanrooms & Spaces, HPC & AI Compute, Production Soundstages.
   - Region/Campus dropdown filter.
   - Checkbox filters for Academic Grant-Eligible Rates and Certified Operator Assistance.
   - Sorting by Institutional Priority, Price (Low to High / High to Low), and Immediate Availability.
   - Empty state with reset action.

4. **Detailed Inspection & Booking Modal (`ResourceModal.tsx`)**:
   - Verified technical specifications sheet.
   - Institutional host credentials & location.
   - Interactive scheduling calculator: duration slider (1–12 hours), operator support toggle, transparent pricing & platform fee breakdown.
   - Simulated inter-laboratory transfer agreement (ILTA) voucher transmission with reference code and status feedback.

5. **Protocol Architecture (`HowItWorks.tsx`)**:
   - 4-stage institutional protocol: 
     1. Index & Discover High-Fidelity Assets
     2. Standardized Institutional Governance (ILTA & COI)
     3. Synchronized Booking & Operator Pairing
     4. Attested Run Logs & Grant Settlement
   - Facility Director call-to-action banner.

6. **Bilateral Value Proposition (`BenefitsSection.tsx`)**:
   - Comparative dual-column framework:
     - For Core Labs & Facility Managers (depreciation recovery, NSF/NIH grant thresholds, priority pre-emption).
     - For Research Teams & Startups (zero capex, bypass multi-month vendor procurement, certified technician support).

7. **Security & Institutional Trust (`InstitutionalTrust.tsx`)**:
   - Federated SSO (InCommon / eduGAIN / SAML 2.0).
   - Automated ILTA and indemnification bonds.
   - ISO 17025 calibration audit log.
   - Physical security and laboratory clearance gating.

8. **Footer (`Footer.tsx`)**:
   - Institutional bulletin newsletter subscription.
   - Detailed platform directory, legal frameworks, and facility onboarding guides.
   - Live network status indicators (Operational, 18ms sync latency, SOC2 Type II).

---

## Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application runs on `http://localhost:3000`.
