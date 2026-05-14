/**
 * lawUpdates.ts
 *
 * This is the single source of truth for tracked immigration law changes.
 * Add a new entry here whenever a salary threshold, processing rule, or
 * directive requirement changes. The app's banner, updates page, and
 * eligibility results all read from this file.
 *
 * HOW TO UPDATE:
 *   1. Add a new LawUpdate object to LAW_UPDATES (newest first).
 *   2. Update the relevant VersionedThreshold in THRESHOLDS if a number changed.
 *   3. If a visa's scoring logic needs to change, update useEligibility.ts too.
 *   4. Bump `verifiedAt` to today's ISO date.
 *
 * DATA CURRENCY POLICY:
 *   Any entry whose `verifiedAt` is more than 90 days old triggers a
 *   "data may be stale" warning in the UI. Update `verifiedAt` after
 *   re-confirming no change has occurred.
 */

import type { LawUpdate, VersionedThreshold } from '../types';

// ─── Last global verification date ──────────────────────────────────────────
export const GLOBAL_VERIFIED_AT = '2026-05-14';

// ─── Law updates (newest first) ─────────────────────────────────────────────
export const LAW_UPDATES: LawUpdate[] = [
  {
    id: 'nl-hsm-threshold-2026',
    effectiveDate: '2026-01-01',
    verifiedAt: '2026-05-14',
    severity: 'important',
    country: 'Netherlands',
    flag: '🇳🇱',
    affectedVisaIds: ['netherlands-hsm'],
    title: 'Netherlands HSM salary threshold increased for 2026',
    summary:
      'The IND has raised the monthly gross salary threshold for Highly Skilled Migrants aged 30 and over from €5,331 to €5,688 (updated annually by the Minister of Social Affairs).',
    what: { before: '€5,331 / month (2025)', after: '€5,688 / month (2026)' },
    actionRequired:
      'If your job offer was drafted against the 2025 threshold, confirm your employer will honour the updated 2026 figure before submission.',
    sourceLabel: 'IND Salary Thresholds 2026',
    sourceUrl: 'https://ind.nl/en/work/working_in_the_netherlands/Pages/Highly-skilled-migrant.aspx',
  },
  {
    id: 'nl-hsm-threshold-under30-2026',
    effectiveDate: '2026-01-01',
    verifiedAt: '2026-05-14',
    severity: 'important',
    country: 'Netherlands',
    flag: '🇳🇱',
    affectedVisaIds: ['netherlands-hsm'],
    title: 'Netherlands HSM under-30 threshold updated for 2026',
    summary:
      'The reduced threshold for HSM applicants under 30 years of age rises from €3,909 to €4,171/month gross from 1 January 2026.',
    what: { before: '€3,909 / month (2025)', after: '€4,171 / month (2026)' },
    actionRequired: 'Verify your contract reflects the 2026 figure if you are under 30.',
    sourceLabel: 'IND Salary Thresholds 2026',
    sourceUrl: 'https://ind.nl/en/work/working_in_the_netherlands/Pages/Highly-skilled-migrant.aspx',
  },
  {
    id: 'de-bluecard-threshold-2025',
    effectiveDate: '2025-03-01',
    verifiedAt: '2026-05-14',
    severity: 'important',
    country: 'Germany',
    flag: '🇩🇪',
    affectedVisaIds: ['germany-eu-bluecard'],
    title: 'Germany EU Blue Card salary threshold updated (2025)',
    summary:
      'Following the recast Blue Card Directive (2021/1883), Germany updated the general annual salary threshold to €45,300 and the shortage-occupation threshold to €41,041 from 1 March 2025.',
    what: { before: '€43,800 general / €39,682 shortage (2024)', after: '€45,300 general / €41,041 shortage (2025)' },
    actionRequired:
      'Ensure your employment contract references the correct 2025 threshold. Shortage occupations include most IT, engineering, and medical roles.',
    sourceLabel: 'BAMF EU Blue Card Germany',
    sourceUrl: 'https://www.bamf.de/EN/Themen/MigrationAufenthalt/ZuwandererDrittstaaten/Arbeit/BlaueKarte/blaue-karte-node.html',
  },
  {
    id: 'de-fachkraefte-expansion-2024',
    effectiveDate: '2024-11-01',
    verifiedAt: '2026-05-14',
    severity: 'important',
    country: 'Germany',
    flag: '🇩🇪',
    affectedVisaIds: ['germany-job-seeker', 'germany-eu-bluecard'],
    title: 'Germany Chancenkarte (Opportunity Card) launched',
    summary:
      'The third wave of Germany\'s Skilled Immigration Act introduced the Chancenkarte — a points-based pre-job-search visa allowing qualified workers to enter Germany for 1 year to find employment, even without a job offer.',
    what: null,
    actionRequired:
      'If you have a university degree and score ≥ 6 points (language, experience, field, age), the Chancenkarte may be faster than the standard job-seeker visa. Check the official points calculator.',
    sourceLabel: 'BAMF Chancenkarte',
    sourceUrl: 'https://www.make-it-in-germany.com/en/visa-residence/types/chancenkarte',
  },
  {
    id: 'pt-d3-threshold-2025',
    effectiveDate: '2025-01-01',
    verifiedAt: '2026-05-14',
    severity: 'minor',
    country: 'Portugal',
    flag: '🇵🇹',
    affectedVisaIds: ['portugal-d3'],
    title: 'Portugal D3 minimum salary updated to €1,611/month',
    summary:
      'Portugal raised the national minimum wage to €1,020/month in 2025. The D3 visa salary requirement (1.5× minimum wage) consequently rises to €1,530/month. Some sources quote the new effective minimum for the D3 as €1,611 including seniority supplements.',
    what: { before: '€1,481 / month (2024)', after: '€1,530–1,611 / month (2025)' },
    actionRequired:
      'Confirm with your employer that your contract meets the updated threshold. The SEF/AIMA applies the figure current at the time of application.',
    sourceLabel: 'AIMA Portugal D3 Visa',
    sourceUrl: 'https://aima.gov.pt/en/visto-residencia/d3-highly-qualified-activity',
  },
  {
    id: 'es-researcher-acogida-2024',
    effectiveDate: '2024-06-01',
    verifiedAt: '2026-05-14',
    severity: 'minor',
    country: 'Spain',
    flag: '🇪🇸',
    affectedVisaIds: ['spain-researcher'],
    title: 'Spain: accredited research institution list expanded',
    summary:
      'Spain\'s Ministry of Science updated the list of accredited research organisations eligible to issue hosting agreements (acuerdos de acogida). Several new private R&D entities were added, broadening access for applicants joining industry research roles.',
    what: null,
    actionRequired:
      'If your host institution is a private company with an R&D division, verify it appears on the current accredited list before asking them to sign a hosting agreement.',
    sourceLabel: 'Ministerio de Ciencia — Entidades Acreditadas',
    sourceUrl: 'https://www.ciencia.gob.es/Convocatorias-Proyectos-y-Resultados/Convocatorias/2022/Acreditacion-de-entidades.html',
  },
  {
    id: 'eu-bluecard-directive-recast-2023',
    effectiveDate: '2023-11-18',
    verifiedAt: '2026-05-14',
    severity: 'critical',
    country: 'EU-wide',
    flag: '🇪🇺',
    affectedVisaIds: ['germany-eu-bluecard', 'italy-talent', 'netherlands-hsm'],
    title: 'Recast EU Blue Card Directive fully transposed (Directive 2021/1883)',
    summary:
      'All Member States were required to transpose Directive 2021/1883/EU by 18 November 2023. Key changes: (1) salary threshold reduced to 1× national average wage (was 1.5×); (2) intra-EU mobility after 12 months (was 18); (3) broader professional experience allowed instead of formal degree in some fields; (4) Blue Card holders\' family members get immediate work authorisation.',
    what: {
      before: 'Salary ≥ 1.5× national average; mobility after 18 months; degree mandatory',
      after: 'Salary ≥ 1× average (shortage: 0.8×); mobility after 12 months; experience accepted in some fields',
    },
    actionRequired:
      'If you were previously ineligible due to the old salary threshold, re-run the eligibility checker — you may now qualify. Family members should apply for work authorisation simultaneously.',
    sourceLabel: 'EUR-Lex — Directive 2021/1883/EU',
    sourceUrl: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32021L1883',
  },
  {
    id: 'nl-orientation-year-ranking-update-2024',
    effectiveDate: '2024-09-01',
    verifiedAt: '2026-05-14',
    severity: 'minor',
    country: 'Netherlands',
    flag: '🇳🇱',
    affectedVisaIds: ['netherlands-orientation'],
    title: 'Netherlands Orientation Year: 2024/25 ranking list published',
    summary:
      'The IND updates the eligible world-ranking list annually (Times Higher Education, QS, Shanghai). For 2024/25, 7 universities moved into or out of the top-200 compared to the prior year. Graduates must verify their university\'s position at the time of application, not graduation.',
    what: null,
    actionRequired:
      'Check your university\'s current ranking on the IND website before applying. The list used is the one current on the date your application is submitted — not the date you graduated.',
    sourceLabel: 'IND Orientation Year — University List 2024/25',
    sourceUrl: 'https://ind.nl/en/orientationyear',
  },
  {
    id: 'be-single-permit-reform-2023',
    effectiveDate: '2023-10-01',
    verifiedAt: '2026-05-14',
    severity: 'important',
    country: 'Belgium',
    flag: '🇧🇪',
    affectedVisaIds: ['belgium-researcher'],
    title: 'Belgium single permit reform: new competence-based category',
    summary:
      'Belgium introduced a new "highly skilled worker" category under the single permit reform, allowing applicants with 5+ years professional experience in a shortage occupation to bypass the degree requirement. Researchers already covered by Directive 2016/801 are unaffected but benefit from aligned processing times.',
    what: null,
    actionRequired:
      'If you lack a formal degree but have 5+ years in a shortage field, you may qualify under the new competence-based pathway. Check the Flemish VDAB or Walloon FOREM shortage list for your profession.',
    sourceLabel: 'Arbeidsmigratie België — Enkelvoudige Vergunning',
    sourceUrl: 'https://www.werk.be/werken-in-vlaanderen/internationaal-talent/enkelvoudige-vergunning',
  },
];

// ─── Versioned thresholds (single source of truth for numeric values) ────────
export const THRESHOLDS: VersionedThreshold[] = [
  {
    id: 'nl-hsm-30plus',
    label: 'Netherlands HSM salary (age 30+)',
    country: 'Netherlands',
    affectedVisaIds: ['netherlands-hsm'],
    value: 5688,
    unit: '€/month gross',
    effectiveDate: '2026-01-01',
    verifiedAt: '2026-05-14',
    sourceLabel: 'IND Salary Thresholds 2026',
    sourceUrl: 'https://ind.nl/en/work/working_in_the_netherlands/Pages/Highly-skilled-migrant.aspx',
  },
  {
    id: 'nl-hsm-under30',
    label: 'Netherlands HSM salary (under 30)',
    country: 'Netherlands',
    affectedVisaIds: ['netherlands-hsm'],
    value: 4171,
    unit: '€/month gross',
    effectiveDate: '2026-01-01',
    verifiedAt: '2026-05-14',
    sourceLabel: 'IND Salary Thresholds 2026',
    sourceUrl: 'https://ind.nl/en/work/working_in_the_netherlands/Pages/Highly-skilled-migrant.aspx',
  },
  {
    id: 'de-bluecard-general',
    label: 'Germany EU Blue Card salary (general)',
    country: 'Germany',
    affectedVisaIds: ['germany-eu-bluecard'],
    value: 45300,
    unit: '€/year gross',
    effectiveDate: '2025-03-01',
    verifiedAt: '2026-05-14',
    sourceLabel: 'BAMF EU Blue Card 2025',
    sourceUrl: 'https://www.bamf.de/EN/Themen/MigrationAufenthalt/ZuwandererDrittstaaten/Arbeit/BlaueKarte/blaue-karte-node.html',
  },
  {
    id: 'de-bluecard-shortage',
    label: 'Germany EU Blue Card salary (shortage occupations)',
    country: 'Germany',
    affectedVisaIds: ['germany-eu-bluecard'],
    value: 41041,
    unit: '€/year gross',
    effectiveDate: '2025-03-01',
    verifiedAt: '2026-05-14',
    sourceLabel: 'BAMF EU Blue Card 2025',
    sourceUrl: 'https://www.bamf.de/EN/Themen/MigrationAufenthalt/ZuwandererDrittstaaten/Arbeit/BlaueKarte/blaue-karte-node.html',
  },
  {
    id: 'de-jobseeker-funds',
    label: 'Germany Job Seeker minimum monthly funds',
    country: 'Germany',
    affectedVisaIds: ['germany-job-seeker'],
    value: 1027,
    unit: '€/month',
    effectiveDate: '2024-01-01',
    verifiedAt: '2026-05-14',
    sourceLabel: 'AufenthG § 20(3)',
    sourceUrl: 'https://www.gesetze-im-internet.de/aufenthg/__20.html',
  },
  {
    id: 'pt-d3-salary',
    label: 'Portugal D3 minimum salary',
    country: 'Portugal',
    affectedVisaIds: ['portugal-d3'],
    value: 1611,
    unit: '€/month gross',
    effectiveDate: '2025-01-01',
    verifiedAt: '2026-05-14',
    sourceLabel: 'AIMA Portugal D3',
    sourceUrl: 'https://aima.gov.pt/en/visto-residencia/d3-highly-qualified-activity',
  },
  {
    id: 'es-student-income',
    label: 'Spain Student Visa minimum monthly funds',
    country: 'Spain',
    affectedVisaIds: ['spain-student'],
    value: 600,
    unit: '€/month',
    effectiveDate: '2023-01-01',
    verifiedAt: '2026-05-14',
    sourceLabel: 'Ley Orgánica 4/2000, Art. 33',
    sourceUrl: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-544',
  },
];

// ─── Helper functions ────────────────────────────────────────────────────────

const STALENESS_DAYS = 90;

export function isStale(verifiedAt: string): boolean {
  const daysSince = (Date.now() - new Date(verifiedAt).getTime()) / (1000 * 60 * 60 * 24);
  return daysSince > STALENESS_DAYS;
}

/** Returns updates effective within the last N days */
export function getRecentUpdates(withinDays = 180): LawUpdate[] {
  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;
  return LAW_UPDATES.filter(u => new Date(u.effectiveDate).getTime() >= cutoff);
}

/** Returns all updates affecting a specific visa ID */
export function getUpdatesForVisa(visaId: string): LawUpdate[] {
  return LAW_UPDATES.filter(
    u => u.affectedVisaIds.includes(visaId) || u.affectedVisaIds.length === 0,
  );
}

/** Returns current threshold value for a threshold ID */
export function getThreshold(id: string): VersionedThreshold | undefined {
  return THRESHOLDS.find(t => t.id === id);
}

/** Returns thresholds affecting a specific visa ID */
export function getThresholdsForVisa(visaId: string): VersionedThreshold[] {
  return THRESHOLDS.filter(t => t.affectedVisaIds.includes(visaId));
}

/** Returns true if any entry in the dataset is stale */
export function hasStaleData(): boolean {
  return (
    LAW_UPDATES.some(u => isStale(u.verifiedAt)) ||
    THRESHOLDS.some(t => isStale(t.verifiedAt)) ||
    isStale(GLOBAL_VERIFIED_AT)
  );
}
