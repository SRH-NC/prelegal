from typing import TypedDict


class FieldDef(TypedDict, total=False):
    name: str
    description: str
    default: str
    options: list[str]


class DocumentTypeConfig(TypedDict):
    display_name: str
    description: str
    required_fields: list[str]
    fields: list[FieldDef]


DOCUMENT_TYPES: dict[str, DocumentTypeConfig] = {
    "mutual_nda": {
        "display_name": "Mutual NDA",
        "description": "A mutual non-disclosure agreement for protecting confidential information between two parties.",
        "required_fields": ["purpose", "governingLaw", "jurisdiction", "party1Company", "party2Company"],
        "fields": [
            {"name": "purpose", "description": "How confidential information may be used", "default": "Evaluating whether to enter into a business relationship with the other party."},
            {"name": "effectiveDate", "description": "When the NDA takes effect (YYYY-MM-DD)", "default": "today's date"},
            {"name": "mndaTermType", "description": "Whether the NDA expires or continues until terminated", "options": ["expires", "until_terminated"], "default": "expires"},
            {"name": "mndaTermYears", "description": "Number of years if term type is 'expires'", "default": "1"},
            {"name": "confidentialityTermType", "description": "Whether confidentiality lasts a set number of years or perpetually", "options": ["years", "perpetual"], "default": "years"},
            {"name": "confidentialityTermYears", "description": "Number of years if confidentiality term type is 'years'", "default": "1"},
            {"name": "governingLaw", "description": "US state whose laws govern the agreement"},
            {"name": "jurisdiction", "description": "Where legal disputes are resolved (e.g. 'courts located in New Castle, DE')"},
            {"name": "modifications", "description": "Any modifications to the standard NDA terms"},
            {"name": "party1Name", "description": "Name of the person signing for Party 1"},
            {"name": "party1Title", "description": "Title of Party 1's signer"},
            {"name": "party1Company", "description": "Company name for Party 1"},
            {"name": "party1Address", "description": "Notice address (email or postal) for Party 1"},
            {"name": "party2Name", "description": "Name of the person signing for Party 2"},
            {"name": "party2Title", "description": "Title of Party 2's signer"},
            {"name": "party2Company", "description": "Company name for Party 2"},
            {"name": "party2Address", "description": "Notice address (email or postal) for Party 2"},
        ],
    },
    "csa": {
        "display_name": "Cloud Service Agreement",
        "description": "A standard agreement for selling and buying cloud software and SaaS products.",
        "required_fields": ["providerName", "customerName", "governingLaw", "chosenCourts"],
        "fields": [
            {"name": "providerName", "description": "Cloud service provider company name"},
            {"name": "customerName", "description": "Customer company name"},
            {"name": "effectiveDate", "description": "Agreement effective date (YYYY-MM-DD)"},
            {"name": "subscriptionPeriod", "description": "Subscription duration (e.g. '1 year')"},
            {"name": "fees", "description": "Subscription fees and payment terms"},
            {"name": "technicalSupport", "description": "Description of technical support provided"},
            {"name": "useLimitations", "description": "Any usage restrictions or limitations"},
            {"name": "generalCapAmount", "description": "General liability cap dollar amount"},
            {"name": "governingLaw", "description": "State whose laws govern the agreement"},
            {"name": "chosenCourts", "description": "Courts for dispute resolution"},
            {"name": "providerNoticeAddress", "description": "Provider's notice address"},
            {"name": "customerNoticeAddress", "description": "Customer's notice address"},
        ],
    },
    "pilot_agreement": {
        "display_name": "Pilot Agreement",
        "description": "A short-term agreement allowing a customer to test a product or service before committing.",
        "required_fields": ["providerName", "customerName", "governingLaw", "chosenCourts"],
        "fields": [
            {"name": "providerName", "description": "Provider company name"},
            {"name": "customerName", "description": "Customer company name"},
            {"name": "effectiveDate", "description": "Agreement effective date (YYYY-MM-DD)"},
            {"name": "pilotPeriod", "description": "Duration of the pilot (e.g. '90 days')"},
            {"name": "evaluationPurpose", "description": "What the customer is evaluating"},
            {"name": "generalCapAmount", "description": "Liability cap dollar amount"},
            {"name": "governingLaw", "description": "State whose laws govern the agreement"},
            {"name": "chosenCourts", "description": "Courts for dispute resolution"},
        ],
    },
    "design_partner": {
        "display_name": "Design Partner Agreement",
        "description": "An agreement for design partnership engagements to collaborate on product development.",
        "required_fields": ["providerName", "partnerName", "governingLaw", "chosenCourts"],
        "fields": [
            {"name": "providerName", "description": "Provider company name"},
            {"name": "partnerName", "description": "Design partner company name"},
            {"name": "effectiveDate", "description": "Agreement effective date (YYYY-MM-DD)"},
            {"name": "term", "description": "Agreement duration"},
            {"name": "program", "description": "Name or description of the design partner program"},
            {"name": "fees", "description": "Any fees for the partnership (if applicable)"},
            {"name": "governingLaw", "description": "State whose laws govern the agreement"},
            {"name": "chosenCourts", "description": "Courts for dispute resolution"},
        ],
    },
    "sla": {
        "display_name": "Service Level Agreement",
        "description": "Defines uptime commitments, support response times, and remedies. Used alongside a Cloud Service Agreement.",
        "required_fields": ["providerName", "customerName", "targetUptime"],
        "fields": [
            {"name": "providerName", "description": "Provider company name"},
            {"name": "customerName", "description": "Customer company name"},
            {"name": "effectiveDate", "description": "Agreement effective date (YYYY-MM-DD)"},
            {"name": "targetUptime", "description": "Uptime commitment (e.g. '99.9%')"},
            {"name": "targetResponseTime", "description": "Support response time (e.g. '4 business hours')"},
            {"name": "supportChannel", "description": "How to submit support requests (email/URL)"},
            {"name": "uptimeCredit", "description": "Credit for uptime failures"},
            {"name": "scheduledDowntime", "description": "Maintenance window details"},
        ],
    },
    "psa": {
        "display_name": "Professional Services Agreement",
        "description": "An agreement for professional services engagements covering statements of work and deliverables.",
        "required_fields": ["providerName", "customerName", "governingLaw", "chosenCourts"],
        "fields": [
            {"name": "providerName", "description": "Services provider company name"},
            {"name": "customerName", "description": "Customer company name"},
            {"name": "effectiveDate", "description": "Agreement effective date (YYYY-MM-DD)"},
            {"name": "deliverables", "description": "Description of deliverables"},
            {"name": "fees", "description": "Fees for professional services"},
            {"name": "paymentPeriod", "description": "Payment terms (e.g. 'Net 30')"},
            {"name": "generalCapAmount", "description": "Liability cap dollar amount"},
            {"name": "governingLaw", "description": "State whose laws govern the agreement"},
            {"name": "chosenCourts", "description": "Courts for dispute resolution"},
        ],
    },
    "dpa": {
        "display_name": "Data Processing Agreement",
        "description": "Defines how personal data is handled, ensuring compliance with data protection regulations (GDPR).",
        "required_fields": ["providerName", "customerName", "dataCategories", "processingPurposes"],
        "fields": [
            {"name": "providerName", "description": "Data processor company name"},
            {"name": "customerName", "description": "Data controller company name"},
            {"name": "effectiveDate", "description": "Agreement effective date (YYYY-MM-DD)"},
            {"name": "dataCategories", "description": "Categories of personal data being processed"},
            {"name": "dataSubjectCategories", "description": "Categories of data subjects (e.g. employees, customers)"},
            {"name": "processingPurposes", "description": "Nature and purpose of data processing"},
            {"name": "processingDuration", "description": "Duration of data processing"},
            {"name": "approvedSubprocessors", "description": "List of approved sub-processors"},
            {"name": "governingMemberState", "description": "EU member state for GDPR disputes"},
        ],
    },
    "partnership": {
        "display_name": "Partnership Agreement",
        "description": "Formalizes technology partnerships covering joint activities, revenue sharing, and collaboration.",
        "required_fields": ["companyName", "partnerName", "governingLaw", "chosenCourts"],
        "fields": [
            {"name": "companyName", "description": "Company name"},
            {"name": "partnerName", "description": "Partner company name"},
            {"name": "effectiveDate", "description": "Agreement effective date (YYYY-MM-DD)"},
            {"name": "obligations", "description": "Description of each party's obligations"},
            {"name": "endDate", "description": "Agreement end date"},
            {"name": "territory", "description": "Geographic scope of the partnership"},
            {"name": "fees", "description": "Fee structure (if applicable)"},
            {"name": "generalCapAmount", "description": "Liability cap dollar amount"},
            {"name": "governingLaw", "description": "State whose laws govern the agreement"},
            {"name": "chosenCourts", "description": "Courts for dispute resolution"},
        ],
    },
    "software_license": {
        "display_name": "Software License Agreement",
        "description": "A standard agreement for licensing software products covering grants, restrictions, and support.",
        "required_fields": ["providerName", "customerName", "governingLaw", "chosenCourts"],
        "fields": [
            {"name": "providerName", "description": "Software licensor company name"},
            {"name": "customerName", "description": "Licensee company name"},
            {"name": "effectiveDate", "description": "Agreement effective date (YYYY-MM-DD)"},
            {"name": "licensedSoftware", "description": "Name/description of the licensed software"},
            {"name": "licenseScope", "description": "Scope of the license (seats, usage limits)"},
            {"name": "subscriptionPeriod", "description": "License duration"},
            {"name": "fees", "description": "License fees and payment terms"},
            {"name": "generalCapAmount", "description": "Liability cap dollar amount"},
            {"name": "governingLaw", "description": "State whose laws govern the agreement"},
            {"name": "chosenCourts", "description": "Courts for dispute resolution"},
        ],
    },
    "baa": {
        "display_name": "Business Associate Agreement",
        "description": "A HIPAA business associate agreement for handling protected health information.",
        "required_fields": ["providerName", "companyName", "services"],
        "fields": [
            {"name": "providerName", "description": "Business associate (provider) company name"},
            {"name": "companyName", "description": "Covered entity company name"},
            {"name": "effectiveDate", "description": "Agreement effective date (YYYY-MM-DD)"},
            {"name": "services", "description": "Description of services the business associate provides"},
            {"name": "breachNotificationPeriod", "description": "Time to notify of a breach (e.g. '72 hours')"},
            {"name": "limitations", "description": "Restrictions on data use (offshore, de-identification, aggregation)"},
        ],
    },
    "ai_addendum": {
        "display_name": "AI Addendum",
        "description": "An addendum addressing AI-specific terms for use with existing agreements.",
        "required_fields": ["providerName", "customerName"],
        "fields": [
            {"name": "providerName", "description": "AI service provider company name"},
            {"name": "customerName", "description": "Customer company name"},
            {"name": "effectiveDate", "description": "Agreement effective date (YYYY-MM-DD)"},
            {"name": "trainingDataPermitted", "description": "Whether customer data can be used for model training (yes/no)"},
            {"name": "trainingPurposes", "description": "Permitted purposes for training on customer data"},
            {"name": "trainingRestrictions", "description": "Restrictions on training usage"},
            {"name": "improvementRestrictions", "description": "Restrictions on non-training improvement usage"},
        ],
    },
}


def build_catalog_summary() -> str:
    lines = ["Available document types:\n"]
    for slug, config in DOCUMENT_TYPES.items():
        lines.append(f"- **{config['display_name']}** (type key: `{slug}`): {config['description']}")
        field_names = [f['name'] for f in config['fields']]
        lines.append(f"  Fields: {', '.join(field_names)}")
        lines.append(f"  Required: {', '.join(config['required_fields'])}")
        lines.append("")
    return "\n".join(lines)


def build_field_descriptions() -> str:
    lines = ["Field definitions by document type:\n"]
    for slug, config in DOCUMENT_TYPES.items():
        lines.append(f"### {config['display_name']} (`{slug}`)")
        for f in config['fields']:
            desc = f.get('description', '')
            default = f.get('default', '')
            options = f.get('options', [])
            parts = [f"- `{f['name']}`: {desc}"]
            if default:
                parts.append(f" (default: {default})")
            if options:
                parts.append(f" (options: {', '.join(options)})")
            lines.append("".join(parts))
        lines.append("")
    return "\n".join(lines)
