import { Building, Building2, Network } from 'lucide-react'
import type * as React from 'react'

import type { OrganisationPortfolioType } from '../../../api/organizations'

export { COUNTRY_OPTIONS, CURRENCY_OPTIONS, LANGUAGE_OPTIONS, PORTFOLIO_LABELS, TIMEZONE_OPTIONS } from '../shared/option-lists'

/** Onboarding's icon-illustrated picker cards; the manage page just uses PORTFOLIO_LABELS in a plain select. */
export const PORTFOLIO_TYPES: { value: OrganisationPortfolioType; title: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'RESIDENTIAL', title: 'Residential portfolio', description: 'Apartments, condominiums, and multifamily communities.', icon: Building2 },
  { value: 'MIXED_USE', title: 'Mixed-use portfolio', description: 'Residential properties with retail or commercial spaces.', icon: Network },
  { value: 'HOSPITALITY', title: 'Hospitality', description: 'Serviced residences and extended-stay properties.', icon: Building },
]
