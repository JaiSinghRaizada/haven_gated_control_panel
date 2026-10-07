import type { OrganisationPortfolioType } from '../../../api/organizations'

export const PORTFOLIO_LABELS: Record<OrganisationPortfolioType, string> = {
  RESIDENTIAL: 'Residential portfolio',
  MIXED_USE: 'Mixed-use portfolio',
  HOSPITALITY: 'Hospitality',
}

export const PORTFOLIO_TYPE_VALUES: OrganisationPortfolioType[] = ['RESIDENTIAL', 'MIXED_USE', 'HOSPITALITY']

export const LANGUAGE_OPTIONS = ['English (US)', 'English (UK)', 'Spanish', 'French']
export const CURRENCY_OPTIONS = ['USD - US Dollar', 'EUR - Euro', 'GBP - British Pound', 'CAD - Canadian Dollar']

export const COUNTRY_OPTIONS = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'India',
  'Germany',
  'France',
  'Spain',
  'Mexico',
  'United Arab Emirates',
]

export const TIMEZONE_OPTIONS = [
  'Eastern Time (UTC-05:00)',
  'Central Time (UTC-06:00)',
  'Mountain Time (UTC-07:00)',
  'Pacific Time (UTC-08:00)',
  'Alaska Time (UTC-09:00)',
  'Hawaii Time (UTC-10:00)',
  'Greenwich Mean Time (UTC+00:00)',
  'Central European Time (UTC+01:00)',
  'India Standard Time (UTC+05:30)',
]
