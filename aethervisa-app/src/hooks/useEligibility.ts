import type { UserProfile, EligibilityResult, VisaOption } from '../types';
import { VISA_OPTIONS } from '../data';

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

  // Visa-specific logic
  switch (visa.id) {
    case 'spain-researcher':
    case 'belgium-researcher': {
      if (profile.hasUniversityOffer) {
        score += 20;
        strengths.push('University/research institution offer greatly increases approval chance');
      } else {
        score -= 20;
        missing.push('Hosting agreement from accredited research institution');
      }
      if (['PhD / Doctorate', 'Postdoctoral', "Master's Degree"].includes(profile.education)) {
        score += 10;
      }
      if (profile.field.includes('Computer') || profile.field.includes('Bio') || profile.field.includes('Physics') || profile.field.includes('Math')) {
        score += 5;
        strengths.push('Your field of study is in high demand at research institutions');
      }
      break;
    }
    case 'spain-student': {
      if (profile.hasUniversityOffer) {
        score += 25;
        strengths.push('University enrollment confirmation is key — you have it');
      } else {
        score -= 25;
        missing.push('University enrollment or acceptance letter');
      }
      if (profile.monthlyIncome >= 600) {
        score += 10;
        strengths.push('Financial means meet the minimum threshold');
      } else {
        score -= 10;
        missing.push('Financial proof of at least €600/month');
      }
      break;
    }
    case 'netherlands-hsm': {
      if (!profile.hasJobOffer) {
        score -= 30;
        missing.push('Job offer from IND-recognized sponsor company');
      } else {
        score += 15;
        strengths.push('Job offer from recognized sponsor is the primary requirement');
      }
      if (profile.monthlyIncome >= 5331) {
        score += 20;
        strengths.push('Salary meets the Highly Skilled Migrant threshold');
      } else {
        score -= 20;
        missing.push('Monthly salary of at least €5,331 (or €3,909 for under 30)');
      }
      break;
    }
    case 'netherlands-orientation': {
      if (profile.education === 'PhD / Doctorate' || profile.education === 'Postdoctoral') {
        score += 15;
        strengths.push('Doctoral degree qualifies for researcher track');
      }
      if (profile.workExperience <= 3) {
        score += 10;
        strengths.push('Recent graduate profile is ideal');
      }
      missing.push('Must have graduated from a top-100 world-ranked university within last 3 years');
      break;
    }
    case 'germany-job-seeker': {
      if (profile.workExperience >= 2) {
        score += 10;
        strengths.push('Work experience strengthens job-seeker applications');
      }
      if (profile.languageLevel === 'B1' || profile.languageLevel === 'B2' || profile.languageLevel === 'C1' || profile.languageLevel === 'C2') {
        score += 15;
        strengths.push('German language skills significantly improve job prospects');
      } else {
        score -= 5;
        missing.push('German language proficiency (B1 minimum recommended)');
      }
      if (profile.monthlyIncome >= 1027) {
        score += 10;
        strengths.push('Financial proof meets minimum requirement');
      } else {
        missing.push('Financial proof of at least €1,027/month during job search');
      }
      break;
    }
    case 'germany-eu-bluecard': {
      if (!profile.hasJobOffer) {
        score -= 35;
        missing.push('Job offer with salary ≥ €45,300/year is mandatory');
      } else {
        score += 20;
        strengths.push('Job offer is confirmed');
      }
      if (profile.monthlyIncome >= 3775) {
        score += 15;
        strengths.push('Salary meets EU Blue Card threshold');
      } else {
        score -= 15;
        missing.push('Annual salary ≥ €45,300 (shortage occupations: €41,041)');
      }
      break;
    }
    case 'italy-talent': {
      if (profile.workExperience >= 3) {
        score += 10;
        strengths.push('3+ years of experience supports talent visa application');
      }
      if (['Computer Science / AI / Machine Learning', 'Engineering (Mechanical/Civil/Electrical)', 'Medicine / Public Health'].includes(profile.field)) {
        score += 10;
        strengths.push('Your field is recognized under Italian talent visa criteria');
      }
      break;
    }
    case 'portugal-d3': {
      score += 5; // Generally accessible
      if (profile.hasJobOffer || profile.hasUniversityOffer) {
        score += 20;
        strengths.push('Employment or research contract makes D3 highly accessible');
      } else {
        score -= 10;
        missing.push('Employment contract or researcher hosting agreement');
      }
      strengths.push('Portugal has lower income thresholds and cost of living');
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

  return { visa, probability, recommendation, missingRequirements: missing, strengths };
}
