import type { UserProfile, EligibilityResult, VisaOption, LegalReference } from '../types';
import { VISA_OPTIONS } from '../data';

// ── Shared EU-level references ──────────────────────────────────────────────

const EU_SINGLE_PERMIT: LegalReference = {
  label: 'Directive 2011/98/EU (Single Permit)',
  description: 'Establishes a single application procedure for a combined work/residence permit and a common set of rights for third-country workers in the EU.',
  url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011L0098',
};

const EU_RESEARCHERS_DIRECTIVE: LegalReference = {
  label: 'Directive 2016/801/EU, Arts. 9–17 (Researchers)',
  description: 'Requires all EU Member States to admit qualifying researchers who hold a hosting agreement with an accredited research organisation. Researchers are entitled to mobility rights across Member States after 180 days.',
  url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016L0801',
};

const EU_STUDENTS_DIRECTIVE: LegalReference = {
  label: 'Directive 2016/801/EU, Arts. 7–8 (Students)',
  description: 'Obliges Member States to admit third-country nationals enrolled in higher education. Defines income and enrolment requirements and grants intra-EU mobility rights after first year.',
  url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016L0801',
};

const EU_BLUECARD_DIRECTIVE: LegalReference = {
  label: 'Directive 2021/1883/EU (EU Blue Card)',
  description: 'Recast directive for EU Blue Card. Sets a salary threshold of 1× the national average gross wage (or 0.8× for shortage occupations). Grants enhanced intra-EU mobility after 12 months.',
  url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32021L1883',
};

const EU_LONG_TERM_RESIDENCE: LegalReference = {
  label: 'Directive 2003/109/EC (Long-term Residence)',
  description: 'After 5 years of legal residence, third-country nationals may apply for long-term resident status, which provides near-equal rights to EU citizens and facilitates movement to other Member States.',
  url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32003L0109',
};

const ECHR_ART8: LegalReference = {
  label: 'ECHR Article 8 (Family / Private Life)',
  description: 'Right to respect for private and family life. Relevant if you have established family ties in the EU — this can strengthen residence applications and appeals against refusals.',
  url: 'https://www.echr.coe.int/documents/d/echr/convention_ENG',
};

const EU_CHARTER_ART15: LegalReference = {
  label: 'EU Charter of Fundamental Rights, Art. 15 (Freedom to Work)',
  description: 'Every person has the right to engage in work and to pursue a freely chosen or accepted occupation. Relevant when Member States impose unreasonable restrictions on access to the labour market.',
  url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:12012P/TXT',
};

// ── Visa-specific national law references ───────────────────────────────────

const SPAIN_RESEARCHER_LAW: LegalReference = {
  label: 'Spain Ley Orgánica 4/2000, Arts. 37–38 bis + RD 557/2011',
  description: 'Transposes the EU Researchers Directive into Spanish law. Article 37 covers the researcher residence authorisation; RD 557/2011 sets out the procedure for the hosting agreement (acuerdo de acogida) with an accredited research entity.',
  url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-544',
};

const SPAIN_STUDENT_LAW: LegalReference = {
  label: 'Spain Ley Orgánica 4/2000, Art. 33 + Circular DGI 2/2023',
  description: 'Grants residence authorisation to enrolled students. The DGI circular clarifies that students may work up to 30 hours per week without changing their student status.',
  url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-544',
};

const NETHERLANDS_HSM_LAW: LegalReference = {
  label: 'Netherlands Vreemdelingenbesluit 2000, Art. 3.30a + IND Circular 2023/5',
  description: 'Sets the Highly Skilled Migrant salary thresholds (updated annually). The IND circular explains the sponsor recognition process — employers must be registered with the IND before issuing an employment offer for HSM purposes.',
  url: 'https://wetten.overheid.nl/BWBR0011825/',
};

const NETHERLANDS_ORIENTATION_LAW: LegalReference = {
  label: 'Netherlands Vreemdelingencirculaire 2000, B9/8 (Orientation Year)',
  description: 'Allows graduates of top-100 world-ranked universities (Times Higher Education or similar) and researchers who completed a funded project to stay 1 year to find work or start a company. No employer sponsor required.',
  url: 'https://ind.nl/en/orientationyear',
};

const GERMANY_JOBSEEKER_LAW: LegalReference = {
  label: 'Germany Aufenthaltsgesetz § 20 (Job-Seeker Visa)',
  description: 'Authorises a 6-month residence permit for qualified professionals to search for employment. Requires a recognised foreign qualification, sufficient funds (≈ €1,027/month), and health insurance. Work is not permitted during this period.',
  url: 'https://www.gesetze-im-internet.de/aufenthg/__20.html',
};

const GERMANY_BLUECARD_LAW: LegalReference = {
  label: 'Germany Aufenthaltsgesetz § 18g (EU Blue Card)',
  description: 'German implementation of Directive 2021/1883/EU. Sets salary thresholds (€45,300 general; €41,041 shortage occupations in 2024). After 27 months (or 21 months with B1 German), the holder may apply for permanent residence.',
  url: 'https://www.gesetze-im-internet.de/aufenthg/__18g.html',
};

const ITALY_TALENT_LAW: LegalReference = {
  label: 'Italy D.Lgs 286/1998, Art. 27-quater (Talent Visa / Visto per Lavoro Altamente Qualificato)',
  description: 'Italian implementation of the EU Blue Card. Also covers the broader "self-employed highly qualified worker" category. A points-based system (nulla osta) applies — applicants score points for qualifications, salary, and economic sector.',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:1998-07-25;286',
};

const BELGIUM_RESEARCHER_LAW: LegalReference = {
  label: 'Belgium Law of 15 Dec 1980 + KB of 2 Oct 2017 (Single Permit / Researcher)',
  description: 'Transposes the EU Researchers Directive into Belgian law. Researchers need a hosting agreement with a recognised research institution. The single permit is issued jointly by the federal aliens office and the regional employment authority.',
  url: 'https://www.ejustice.just.fgov.be/cgi_loi/loi_a.pl?language=nl&caller=list&cn=1980121530&la=n&fromtab=wet&sql=dt=%27wet%27+and+dd=%271980-12-15%27+and+la=%27n%27',
};

const PORTUGAL_D3_LAW: LegalReference = {
  label: 'Portugal Lei 23/2007, Art. 90-A (D3 Highly Qualified Activity)',
  description: 'Residence visa for highly qualified third-country nationals exercising professional activity in Portugal. Requires a work contract or research hosting agreement. Lower salary threshold than most EU countries — €1,611.10/month in 2024.',
  url: 'https://www.sef.pt/en/pages/conteudo-detalhe.aspx?nID=8',
};

// ── Profile-driven contextual references ────────────────────────────────────

function getProfileRefs(profile: UserProfile): LegalReference[] {
  const refs: LegalReference[] = [];

  if (profile.familySize > 1) {
    refs.push(ECHR_ART8);
    refs.push({
      label: 'Directive 2003/86/EC (Family Reunification)',
      description: 'Gives third-country nationals with a valid residence permit the right to request family reunification for spouse and minor children. Member States may impose a 12-month waiting period.',
      url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32003L0086',
    });
  }

  if (profile.education === 'PhD / Doctorate' || profile.education === 'Postdoctoral') {
    refs.push(EU_RESEARCHERS_DIRECTIVE);
  }

  if (profile.workExperience >= 5) {
    refs.push(EU_LONG_TERM_RESIDENCE);
  }

  if (profile.hasJobOffer) {
    refs.push(EU_SINGLE_PERMIT);
    refs.push(EU_CHARTER_ART15);
  }

  return refs;
}

// ── Main export ──────────────────────────────────────────────────────────────

export function calculateEligibility(profile: UserProfile): EligibilityResult[] {
  const results: EligibilityResult[] = [];

  for (const visa of VISA_OPTIONS) {
    const result = scoreVisa(visa, profile);
    results.push(result);
  }

  return results.sort((a, b) => b.probability - a.probability);
}

function scoreVisa(visa: VisaOption, profile: UserProfile): EligibilityResult {
  let score = 50;
  const strengths: string[] = [];
  const missing: string[] = [];
  let recommendation = '';
  const legalBasis: LegalReference[] = [];

  // Education scoring
  if (profile.education === 'PhD / Doctorate' || profile.education === 'Postdoctoral') {
    score += 15;
    strengths.push('Doctoral-level education is highly valued');
  } else if (profile.education === "Master's Degree") {
    score += 10;
    strengths.push('Master\'s degree meets most requirements');
  } else if (profile.education === "Bachelor's Degree") {
    score += 5;
  }

  // Visa-specific logic + legal basis
  switch (visa.id) {
    case 'spain-researcher': {
      legalBasis.push(EU_RESEARCHERS_DIRECTIVE, SPAIN_RESEARCHER_LAW, EU_LONG_TERM_RESIDENCE);
      if (profile.hasUniversityOffer) {
        score += 20;
        strengths.push('University/research institution offer greatly increases approval chance');
        legalBasis.push({
          label: 'Directive 2016/801/EU, Art. 10 (Hosting Agreement)',
          description: 'Your hosting agreement with an accredited research organisation is the cornerstone of the researcher visa application. Art. 10 specifies the minimum contents the agreement must contain (objectives, supervision, resources, dates).',
          url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016L0801',
        });
      } else {
        score -= 20;
        missing.push('Hosting agreement from accredited research institution (required by Directive 2016/801, Art. 10)');
      }
      if (['PhD / Doctorate', 'Postdoctoral', "Master's Degree"].includes(profile.education)) {
        score += 10;
      }
      if (profile.field.includes('Computer') || profile.field.includes('Bio') || profile.field.includes('Physics') || profile.field.includes('Math')) {
        score += 5;
        strengths.push('Your field of study is in high demand at research institutions');
      }
      // Spanish language scoring
      const esLevelR = profile.languageLevels?.es ?? 'None';
      if (['B2', 'C1', 'C2'].includes(esLevelR)) {
        score += 8;
        strengths.push('Spanish proficiency aids daily integration and departmental communication');
      } else if (['B1'].includes(esLevelR)) {
        score += 4;
      } else {
        missing.push('Spanish language skills (not required for researcher visa but aids integration — consider A2 minimum)');
      }
      break;
    }

    case 'belgium-researcher': {
      legalBasis.push(EU_RESEARCHERS_DIRECTIVE, BELGIUM_RESEARCHER_LAW, EU_LONG_TERM_RESIDENCE);
      if (profile.hasUniversityOffer) {
        score += 20;
        strengths.push('University/research institution offer greatly increases approval chance');
        legalBasis.push({
          label: 'Directive 2016/801/EU, Art. 10 (Hosting Agreement)',
          description: 'Your hosting agreement with an accredited research organisation is the cornerstone of the researcher visa application. Art. 10 specifies the minimum contents the agreement must contain.',
          url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016L0801',
        });
      } else {
        score -= 20;
        missing.push('Hosting agreement from accredited research institution (required by Directive 2016/801, Art. 10)');
      }
      if (['PhD / Doctorate', 'Postdoctoral', "Master's Degree"].includes(profile.education)) {
        score += 10;
      }
      if (profile.field.includes('Computer') || profile.field.includes('Bio') || profile.field.includes('Physics') || profile.field.includes('Math')) {
        score += 5;
        strengths.push('Your field of study is in high demand at research institutions');
      }
      // Belgium: Dutch (primary), French (secondary), German (tertiary)
      const nlLevelBE = profile.languageLevels?.nl ?? 'None';
      const frLevelBE = profile.languageLevels?.fr ?? 'None';
      const deLevelBE = profile.languageLevels?.de ?? profile.languageLevel ?? 'None';
      if (['B1', 'B2', 'C1', 'C2'].includes(nlLevelBE)) {
        score += 8;
        strengths.push('Dutch proficiency is advantageous for Flemish institutions (majority of Belgian research output)');
      } else if (['B1', 'B2', 'C1', 'C2'].includes(frLevelBE)) {
        score += 6;
        strengths.push('French proficiency opens access to Walloon and Brussels-based institutions');
      } else if (['B1', 'B2', 'C1', 'C2'].includes(deLevelBE)) {
        score += 3;
        strengths.push('German proficiency covers the small German-speaking community (Ostbelgien)');
      } else {
        missing.push('Language proficiency recommended: Dutch (nl) for Flanders, French (fr) for Wallonia/Brussels, German (de) for East Belgium');
      }
      break;
    }

    case 'spain-student': {
      legalBasis.push(EU_STUDENTS_DIRECTIVE, SPAIN_STUDENT_LAW);
      if (profile.hasUniversityOffer) {
        score += 25;
        strengths.push('University enrollment confirmation is key — you have it');
        legalBasis.push({
          label: 'Directive 2016/801/EU, Art. 7(1)(c) (Proof of Enrollment)',
          description: 'Proof of admission to or enrollment in an establishment of higher education is a mandatory condition for the student visa under EU law. Your acceptance letter directly satisfies this requirement.',
          url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016L0801',
        });
      } else {
        score -= 25;
        missing.push('University enrollment or acceptance letter (required by Directive 2016/801, Art. 7(1)(c))');
      }
      if (profile.monthlyIncome >= 600) {
        score += 10;
        strengths.push('Financial means meet the minimum threshold');
      } else {
        score -= 10;
        missing.push('Financial proof of at least €600/month (Directive 2016/801, Art. 7(1)(e))');
      }
      // Spanish language scoring
      const esLevelS = profile.languageLevels?.es ?? 'None';
      if (['B1', 'B2', 'C1', 'C2'].includes(esLevelS)) {
        score += 10;
        strengths.push('Spanish proficiency strengthens integration and academic performance prospects');
      } else if (esLevelS === 'A2') {
        score += 4;
      } else {
        missing.push('Spanish language skills recommended — institutions often require B2 for Spanish-taught programmes (DELE certificate preferred)');
      }
      break;
    }

    case 'netherlands-hsm': {
      legalBasis.push(NETHERLANDS_HSM_LAW, EU_SINGLE_PERMIT, EU_LONG_TERM_RESIDENCE);
      if (!profile.hasJobOffer) {
        score -= 30;
        missing.push('Job offer from IND-recognized sponsor company (Vreemdelingenbesluit 2000, Art. 3.30a)');
      } else {
        score += 15;
        strengths.push('Job offer from recognized sponsor is the primary requirement');
        legalBasis.push({
          label: 'Netherlands IND Recognized Sponsor Scheme',
          description: 'Your employer must be registered with the IND as a "recognized sponsor" (erkend referent). This is non-negotiable — only recognised sponsors can submit HSM applications on behalf of applicants.',
          url: 'https://ind.nl/en/recognised-sponsor',
        });
      }
      if (profile.monthlyIncome >= 5331) {
        score += 20;
        strengths.push('Salary meets the Highly Skilled Migrant threshold');
        legalBasis.push({
          label: 'Netherlands Vreemdelingenbesluit 2000, Art. 3.30a (Salary Thresholds)',
          description: 'Monthly gross salary must be ≥ €5,331 for applicants aged 30+ (2024 figure, updated annually). For applicants under 30, the threshold is €3,909. Your salary meets this threshold.',
          url: 'https://wetten.overheid.nl/BWBR0011825/',
        });
      } else {
        score -= 20;
        missing.push('Monthly salary of at least €5,331 gross (or €3,909 if under 30) — Vreemdelingenbesluit 2000, Art. 3.30a');
      }
      // Dutch language: not required but useful for integration
      const nlLevelHSM = profile.languageLevels?.nl ?? 'None';
      if (['B1', 'B2', 'C1', 'C2'].includes(nlLevelHSM)) {
        score += 5;
        strengths.push('Dutch proficiency will ease the mandatory civic integration (inburgering) requirement');
      }
      break;
    }

    case 'netherlands-orientation': {
      legalBasis.push(NETHERLANDS_ORIENTATION_LAW, EU_STUDENTS_DIRECTIVE);
      if (profile.education === 'PhD / Doctorate' || profile.education === 'Postdoctoral') {
        score += 15;
        strengths.push('Doctoral degree qualifies for researcher track');
        legalBasis.push({
          label: 'Netherlands Vreemdelingencirculaire B9/8.3 (Researcher Track)',
          description: 'Researchers who completed a funded project in the Netherlands under Directive 2016/801 are entitled to apply for the Orientation Year permit without university ranking requirements.',
          url: 'https://ind.nl/en/orientationyear',
        });
      }
      if (profile.workExperience <= 3) {
        score += 10;
        strengths.push('Recent graduate profile is ideal');
      }
      legalBasis.push({
        label: 'Netherlands Vreemdelingencirculaire B9/8.2 (Top-100 Ranking Requirement)',
        description: 'Applicants must hold a degree from a university ranked in the top 100 of the Times Higher Education, QS, or Shanghai world rankings, and must apply within 3 years of graduation.',
        url: 'https://ind.nl/en/orientationyear',
      });
      missing.push('Must have graduated from a top-100 world-ranked university within last 3 years (Vreemdelingencirculaire B9/8.2)');
      break;
    }

    case 'germany-job-seeker': {
      legalBasis.push(GERMANY_JOBSEEKER_LAW, EU_CHARTER_ART15);
      if (profile.workExperience >= 2) {
        score += 10;
        strengths.push('Work experience strengthens job-seeker applications');
      }
      const deLevelJS = profile.languageLevels?.de ?? profile.languageLevel ?? 'None';
      if (['B1', 'B2', 'C1', 'C2'].includes(deLevelJS)) {
        score += 15;
        strengths.push('German language skills significantly improve job prospects');
      } else {
        score -= 5;
        missing.push('German language proficiency (B1 minimum recommended, per § 20 AufenthG)');
      }
      if (profile.monthlyIncome >= 1027) {
        score += 10;
        strengths.push('Financial proof meets minimum requirement');
        legalBasis.push({
          label: 'Germany Aufenthaltsgesetz § 20(3) (Financial Means)',
          description: 'Applicants must demonstrate sufficient financial means for the entire stay without recourse to public funds. The standard is derived from the monthly BAföG rate (≈ €1,027 in 2024). Bank statements or a blocked account (Sperrkonto) are accepted.',
          url: 'https://www.gesetze-im-internet.de/aufenthg/__20.html',
        });
      } else {
        missing.push('Financial proof of at least €1,027/month during job search (§ 20(3) AufenthG)');
      }
      legalBasis.push({
        label: 'Germany Fachkräfteeinwanderungsgesetz 2020 (Skilled Immigration Act)',
        description: 'Broadened recognition of foreign qualifications and extended the job-seeker visa to include all regulated and non-regulated professions, not just STEM roles. If your qualification is not yet recognised, you may apply simultaneously.',
        url: 'https://www.gesetze-im-internet.de/fachkraefteeinwg/index.html',
      });
      break;
    }

    case 'germany-eu-bluecard': {
      legalBasis.push(EU_BLUECARD_DIRECTIVE, GERMANY_BLUECARD_LAW, EU_LONG_TERM_RESIDENCE);
      if (!profile.hasJobOffer) {
        score -= 35;
        missing.push('Binding job offer with salary ≥ €45,300/year is mandatory (§ 18g AufenthG)');
      } else {
        score += 20;
        strengths.push('Job offer is confirmed');
      }
      if (profile.monthlyIncome >= 3775) {
        score += 15;
        strengths.push('Salary meets EU Blue Card threshold');
        legalBasis.push({
          label: 'Germany Aufenthaltsgesetz § 18g(2) (Salary Threshold)',
          description: 'General threshold is 1× the annual mean gross wage (€45,300 in 2024). For shortage occupations (STEM, IT, medicine), the threshold is reduced to 0.9× (€41,041 in 2024). Your salary satisfies this condition.',
          url: 'https://www.gesetze-im-internet.de/aufenthg/__18g.html',
        });
      } else {
        score -= 15;
        missing.push('Annual salary ≥ €45,300 general or €41,041 shortage occupations (§ 18g(2) AufenthG)');
      }
      break;
    }

    case 'italy-talent': {
      legalBasis.push(ITALY_TALENT_LAW, EU_BLUECARD_DIRECTIVE);
      if (profile.workExperience >= 3) {
        score += 10;
        strengths.push('3+ years of experience supports talent visa application');
      }
      if (['Computer Science / AI / Machine Learning', 'Engineering (Mechanical/Civil/Electrical)', 'Medicine / Public Health'].includes(profile.field)) {
        score += 10;
        strengths.push('Your field is recognized under Italian talent visa criteria');
        legalBasis.push({
          label: 'Italy D.Lgs 286/1998, Art. 27-quater(1) (Shortage Occupations)',
          description: 'Italy grants fast-track nulla osta for professionals in sectors listed as shortage occupations by the Ministry of Labour. IT, engineering, and healthcare are currently on this list, reducing the points required for approval.',
          url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:1998-07-25;286',
        });
      }
      legalBasis.push({
        label: 'Italy Decreto Flussi (Annual Quota System)',
        description: 'Italy operates an annual quota decree (decreto flussi) for non-EU workers. EU Blue Card / highly qualified worker applications are exempt from these quotas under Art. 27-quater — you can apply at any time of year.',
        url: 'https://www.interno.gov.it/it/temi/immigrazione-e-asilo/politiche-migratorie/ingressi-di-lavoro',
      });
      break;
    }

    case 'portugal-d3': {
      legalBasis.push(PORTUGAL_D3_LAW, EU_SINGLE_PERMIT, EU_LONG_TERM_RESIDENCE);
      score += 5;
      if (profile.hasJobOffer || profile.hasUniversityOffer) {
        score += 20;
        strengths.push('Employment or research contract makes D3 highly accessible');
        legalBasis.push({
          label: 'Portugal Lei 23/2007, Art. 90-A(2) (Contract Requirement)',
          description: 'A valid employment contract or research hosting agreement satisfies the primary admissibility condition for the D3 visa. The contract must specify a gross salary of at least 1.5× the minimum wage (€1,611/month in 2024).',
          url: 'https://www.sef.pt/en/pages/conteudo-detalhe.aspx?nID=8',
        });
      } else {
        score -= 10;
        missing.push('Employment contract or researcher hosting agreement (Lei 23/2007, Art. 90-A(2))');
      }
      strengths.push('Portugal has lower income thresholds and cost of living');
      legalBasis.push({
        label: 'Portugal Portaria 1563/2007 (IEFP Certified Shortage Occupations)',
        description: 'Portugal maintains a list of shortage occupations where D3 applicants benefit from simplified processing. IT and engineering are currently included, and applicants in these fields may receive visa decisions in as little as 30 days.',
        url: 'https://www.sef.pt/en/',
      });
      break;
    }
  }

  // General adjustments
  if (profile.workExperience >= 5) {
    score += 5;
    strengths.push('Strong work experience record');
  }
  if (profile.monthlyIncome > 3000) {
    score += 5;
    strengths.push('Solid financial profile');
  }

  // Profile-driven contextual legal references (family, long-term, etc.)
  for (const ref of getProfileRefs(profile)) {
    if (!legalBasis.some(r => r.label === ref.label)) {
      legalBasis.push(ref);
    }
  }

  // Clamp between 10 and 92
  const probability = Math.min(92, Math.max(10, Math.round(score)));

  if (probability >= 70) {
    recommendation = 'Strong candidate — you meet most requirements. Begin gathering documents now.';
  } else if (probability >= 50) {
    recommendation = 'Moderate chance — address the missing requirements to significantly improve your odds.';
  } else if (probability >= 30) {
    recommendation = 'Challenging — significant gaps exist. Consider strengthening your profile or exploring alternatives.';
  } else {
    recommendation = 'Low eligibility with current profile. Focus on addressing the key missing requirements first.';
  }

  return { visa, probability, recommendation, missingRequirements: missing, strengths, legalBasis };
}

