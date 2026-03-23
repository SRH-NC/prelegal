export interface NdaFormData {
  purpose: string;
  effectiveDate: string;
  mndaTermType: "expires" | "until_terminated";
  mndaTermYears: string;
  confidentialityTermType: "years" | "perpetual";
  confidentialityTermYears: string;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
  party1Name: string;
  party1Title: string;
  party1Company: string;
  party1Address: string;
  party2Name: string;
  party2Title: string;
  party2Company: string;
  party2Address: string;
}

export const defaultFormData: NdaFormData = {
  purpose:
    "Evaluating whether to enter into a business relationship with the other party.",
  effectiveDate: new Date().toISOString().split("T")[0],
  mndaTermType: "expires",
  mndaTermYears: "1",
  confidentialityTermType: "years",
  confidentialityTermYears: "1",
  governingLaw: "",
  jurisdiction: "",
  modifications: "",
  party1Name: "",
  party1Title: "",
  party1Company: "",
  party1Address: "",
  party2Name: "",
  party2Title: "",
  party2Company: "",
  party2Address: "",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "___________";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function blank(value: string, placeholder: string): string {
  return value.trim() || placeholder;
}

function safeYears(value: string): string {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 1 ? "1" : String(parsed);
}

export function generateCoverPage(data: NdaFormData): string {
  const mndaYears = safeYears(data.mndaTermYears);
  const confYears = safeYears(data.confidentialityTermYears);

  const mndaTerm =
    data.mndaTermType === "expires"
      ? `- [x] Expires ${mndaYears} year(s) from Effective Date.\n- [ ] Continues until terminated in accordance with the terms of the MNDA.`
      : `- [ ] Expires from Effective Date.\n- [x] Continues until terminated in accordance with the terms of the MNDA.`;

  const confidentialityTerm =
    data.confidentialityTermType === "years"
      ? `- [x] ${confYears} year(s) from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.\n- [ ] In perpetuity.`
      : `- [ ] From Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.\n- [x] In perpetuity.`;

  const modificationsSection = data.modifications.trim()
    ? data.modifications
    : "None.";

  return `# Mutual Non-Disclosure Agreement

## Cover Page

This Mutual Non-Disclosure Agreement (the "MNDA") consists of: (1) this Cover Page ("**Cover Page**") and (2) the Common Paper Mutual NDA Standard Terms Version 1.0 ("**Standard Terms**"). Any modifications of the Standard Terms should be made on the Cover Page, which will control over conflicts with the Standard Terms.

### Purpose

${blank(data.purpose, "___________")}

### Effective Date

${formatDate(data.effectiveDate)}

### MNDA Term

${mndaTerm}

### Term of Confidentiality

${confidentialityTerm}

### Governing Law & Jurisdiction

Governing Law: ${blank(data.governingLaw, "___________")}

Jurisdiction: ${blank(data.jurisdiction, "___________")}

### MNDA Modifications

${modificationsSection}

---

By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.

|  | PARTY 1 | PARTY 2 |
|:---|:---:|:---:|
| Signature | _______________ | _______________ |
| Print Name | ${blank(data.party1Name, "_______________")} | ${blank(data.party2Name, "_______________")} |
| Title | ${blank(data.party1Title, "_______________")} | ${blank(data.party2Title, "_______________")} |
| Company | ${blank(data.party1Company, "_______________")} | ${blank(data.party2Company, "_______________")} |
| Notice Address | ${blank(data.party1Address, "_______________")} | ${blank(data.party2Address, "_______________")} |
| Date | _______________ | _______________ |`;
}

export function generateStandardTerms(): string {
  return `
---

## Standard Terms

1. **Introduction**. This Mutual Non-Disclosure Agreement (which incorporates these Standard Terms and the Cover Page (defined below)) ("**MNDA**") allows each party ("**Disclosing Party**") to disclose or make available information in connection with the Purpose which (1) the Disclosing Party identifies to the receiving party ("**Receiving Party**") as "confidential", "proprietary", or the like or (2) should be reasonably understood as confidential or proprietary due to its nature and the circumstances of its disclosure ("**Confidential Information**"). Each party's Confidential Information also includes the existence and status of the parties' discussions and information on the Cover Page. Confidential Information includes technical or business information, product designs or roadmaps, requirements, pricing, security and compliance documentation, technology, inventions and know-how. To use this MNDA, the parties must complete and sign a cover page incorporating these Standard Terms ("**Cover Page**"). Each party is identified on the Cover Page and capitalized terms have the meanings given herein or on the Cover Page.

2. **Use and Protection of Confidential Information**. The Receiving Party shall: (a) use Confidential Information solely for the Purpose; (b) not disclose Confidential Information to third parties without the Disclosing Party's prior written approval, except that the Receiving Party may disclose Confidential Information to its employees, agents, advisors, contractors and other representatives having a reasonable need to know for the Purpose, provided these representatives are bound by confidentiality obligations no less protective of the Disclosing Party than the applicable terms in this MNDA and the Receiving Party remains responsible for their compliance with this MNDA; and (c) protect Confidential Information using at least the same protections the Receiving Party uses for its own similar information but no less than a reasonable standard of care.

3. **Exceptions**. The Receiving Party's obligations in this MNDA do not apply to information that it can demonstrate: (a) is or becomes publicly available through no fault of the Receiving Party; (b) it rightfully knew or possessed prior to receipt from the Disclosing Party without confidentiality restrictions; (c) it rightfully obtained from a third party without confidentiality restrictions; or (d) it independently developed without using or referencing the Confidential Information.

4. **Disclosures Required by Law**. The Receiving Party may disclose Confidential Information to the extent required by law, regulation or regulatory authority, subpoena or court order, provided (to the extent legally permitted) it provides the Disclosing Party reasonable advance notice of the required disclosure and reasonably cooperates, at the Disclosing Party's expense, with the Disclosing Party's efforts to obtain confidential treatment for the Confidential Information.

5. **Term and Termination**. This MNDA commences on the Effective Date and expires at the end of the MNDA Term. Either party may terminate this MNDA for any or no reason upon written notice to the other party. The Receiving Party's obligations relating to Confidential Information will survive for the Term of Confidentiality, despite any expiration or termination of this MNDA.

6. **Return or Destruction of Confidential Information**. Upon expiration or termination of this MNDA or upon the Disclosing Party's earlier request, the Receiving Party will: (a) cease using Confidential Information; (b) promptly after the Disclosing Party's written request, destroy all Confidential Information in the Receiving Party's possession or control or return it to the Disclosing Party; and (c) if requested by the Disclosing Party, confirm its compliance with these obligations in writing. As an exception to subsection (b), the Receiving Party may retain Confidential Information in accordance with its standard backup or record retention policies or as required by law, but the terms of this MNDA will continue to apply to the retained Confidential Information.

7. **Proprietary Rights**. The Disclosing Party retains all of its intellectual property and other rights in its Confidential Information and its disclosure to the Receiving Party grants no license under such rights.

8. **Disclaimer**. ALL CONFIDENTIAL INFORMATION IS PROVIDED "AS IS", WITH ALL FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.

9. **Governing Law and Jurisdiction**. This MNDA and all matters relating hereto are governed by, and construed in accordance with, the laws of the state of the Governing Law, without regard to the conflict of laws provisions of such state. Any legal suit, action, or proceeding relating to this MNDA must be instituted in the federal or state courts located in the Jurisdiction. Each party irrevocably submits to the exclusive jurisdiction of such courts.

10. **Equitable Relief**. A breach of this MNDA may cause irreparable harm for which monetary damages are an insufficient remedy. Upon a breach of this MNDA, the Disclosing Party is entitled to seek appropriate equitable relief, including an injunction, in addition to its other remedies.

11. **General**. Neither party has an obligation under this MNDA to disclose Confidential Information to the other or proceed with any proposed transaction. Neither party may assign this MNDA without the prior written consent of the other party, except that either party may assign this MNDA in connection with a merger, reorganization, acquisition or other transfer of all or substantially all its assets or voting securities. Any assignment in violation of this Section is null and void. This MNDA will bind and inure to the benefit of each party's permitted successors and assigns. Waivers must be signed by the waiving party's authorized representative and cannot be implied from conduct. If any provision of this MNDA is held unenforceable, it will be limited to the minimum extent necessary so the rest of this MNDA remains in effect. This MNDA (including the Cover Page) constitutes the entire agreement of the parties with respect to its subject matter, and supersedes all prior and contemporaneous understandings, agreements, representations, and warranties, whether written or oral, regarding such subject matter. This MNDA may only be amended, modified, waived, or supplemented by an agreement in writing signed by both parties. Notices, requests and approvals under this MNDA must be sent in writing to the email or postal addresses on the Cover Page and are deemed delivered on receipt. This MNDA may be executed in counterparts, including electronic copies, each of which is deemed an original and which together form the same agreement.

---

*Common Paper Mutual Non-Disclosure Agreement [Version 1.0](https://commonpaper.com/standards/mutual-nda/1.0/) free to use under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).*`;
}

export function generateFullNda(data: NdaFormData): string {
  return generateCoverPage(data) + "\n" + generateStandardTerms() + "\n";
}
