/* Public settings only. Do not store passwords, private keys or API credentials here. */
window.ROBOTGO_CONFIG = {
  version: '0.6.0-seo-leads',
  releaseStage: 'accounts-live',
  domainTarget: 'robotgo.ro', // HTTPS verified on 2026-10-30.
  domainStatus: 'verified',
  brandClearance: 'not_verified',
  backendEnabled: false,
  demo: false,
  whatsappNumber: '40778167507',
  email: 'robotgo100@gmail.com',
  companyName: 'ROUTEX LOGISTICA S.R.L.',
  phoneNumber: '+40778167507',
  address: 'Strada Episcopiei, București, Sectorul 4, scara 3, etaj 5, apartament 77',
  vatId: '54708422',
  vatRegistered: true,
  registrationNo: '',
  openingHours: 'Luni–vineri, 09:00–17:00',
  openingHoursEn: 'Monday–Friday, 09:00–17:00 (Romania)',
  orderMode: 'quotation',
  quoteCurrency: 'EUR',
  paymentMethod: 'bank_transfer',
  paymentTerms: 'advance_payment',
  bankDetailsVisibility: 'quotation_only',
  shippingIncluded: true,
  shippingCountryCode: 'RO',
  customerTypes: ['individual', 'business'],
  aiEndpoint: '/api/consult',
  leadEndpoint: '/api/auth/leads',
  leadsEnabled: true,
  // Public website tracker identifier for the existing RobotGo Metricool brand.
  // This is not an API token. Tracking requires a new, explicit visitor opt-in.
  metricoolHash: '55560498b07b2fd1cc4109c96fc58cfd',
  upgradePreviewImages: true,
  upgradeHeroImages: false
};
