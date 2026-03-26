export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  mutual_nda: "Mutual Non-Disclosure Agreement",
  csa: "Cloud Service Agreement",
  pilot_agreement: "Pilot Agreement",
  design_partner: "Design Partner Agreement",
  sla: "Service Level Agreement",
  psa: "Professional Services Agreement",
  dpa: "Data Processing Agreement",
  partnership: "Partnership Agreement",
  software_license: "Software License Agreement",
  baa: "Business Associate Agreement",
  ai_addendum: "AI Addendum",
};

export function getDocumentTitle(docType: string): string {
  return DOCUMENT_TYPE_LABELS[docType] || docType;
}

export function getDownloadFilename(docType: string): string {
  const names: Record<string, string> = {
    mutual_nda: "Mutual-NDA.md",
    csa: "Cloud-Service-Agreement.md",
    pilot_agreement: "Pilot-Agreement.md",
    design_partner: "Design-Partner-Agreement.md",
    sla: "Service-Level-Agreement.md",
    psa: "Professional-Services-Agreement.md",
    dpa: "Data-Processing-Agreement.md",
    partnership: "Partnership-Agreement.md",
    software_license: "Software-License-Agreement.md",
    baa: "Business-Associate-Agreement.md",
    ai_addendum: "AI-Addendum.md",
  };
  return names[docType] || "Document.md";
}

// Human-readable labels for field names
const FIELD_LABELS: Record<string, string> = {
  providerName: "Provider",
  customerName: "Customer",
  companyName: "Company",
  partnerName: "Partner",
  effectiveDate: "Effective Date",
  governingLaw: "Governing Law",
  chosenCourts: "Chosen Courts",
  jurisdiction: "Jurisdiction",
  generalCapAmount: "General Liability Cap",
  fees: "Fees",
  subscriptionPeriod: "Subscription Period",
  pilotPeriod: "Pilot Period",
  term: "Term",
  endDate: "End Date",
  technicalSupport: "Technical Support",
  useLimitations: "Use Limitations",
  evaluationPurpose: "Evaluation Purpose",
  program: "Program",
  deliverables: "Deliverables",
  paymentPeriod: "Payment Period",
  targetUptime: "Target Uptime",
  targetResponseTime: "Target Response Time",
  supportChannel: "Support Channel",
  uptimeCredit: "Uptime Credit",
  scheduledDowntime: "Scheduled Downtime",
  dataCategories: "Categories of Personal Data",
  dataSubjectCategories: "Data Subject Categories",
  processingPurposes: "Processing Purposes",
  processingDuration: "Processing Duration",
  approvedSubprocessors: "Approved Sub-processors",
  governingMemberState: "Governing EU Member State",
  obligations: "Obligations",
  territory: "Territory",
  licensedSoftware: "Licensed Software",
  licenseScope: "License Scope",
  services: "Services",
  breachNotificationPeriod: "Breach Notification Period",
  limitations: "Limitations",
  trainingDataPermitted: "Training Data Permitted",
  trainingPurposes: "Training Purposes",
  trainingRestrictions: "Training Restrictions",
  improvementRestrictions: "Improvement Restrictions",
  providerNoticeAddress: "Provider Notice Address",
  customerNoticeAddress: "Customer Notice Address",
  modifications: "Modifications",
  purpose: "Purpose",
  mndaTermType: "MNDA Term Type",
  mndaTermYears: "MNDA Term (Years)",
  confidentialityTermType: "Confidentiality Term Type",
  confidentialityTermYears: "Confidentiality Term (Years)",
  party1Name: "Party 1 Name",
  party1Title: "Party 1 Title",
  party1Company: "Party 1 Company",
  party1Address: "Party 1 Notice Address",
  party2Name: "Party 2 Name",
  party2Title: "Party 2 Title",
  party2Company: "Party 2 Company",
  party2Address: "Party 2 Notice Address",
};

export function getFieldLabel(fieldName: string): string {
  return FIELD_LABELS[fieldName] || fieldName;
}
