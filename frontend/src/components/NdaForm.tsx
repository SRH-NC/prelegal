"use client";

import { NdaFormData } from "@/lib/generateNda";

interface NdaFormProps {
  formData: NdaFormData;
  onChange: (data: NdaFormData) => void;
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-zinc-700">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";

function PartyFields({
  prefix,
  label,
  formData,
  update,
}: {
  prefix: "party1" | "party2";
  label: string;
  formData: NdaFormData;
  update: (fields: Partial<NdaFormData>) => void;
}) {
  return (
    <>
      <h2 className="text-lg font-semibold text-zinc-900">
        {label}{" "}
        <span className="text-sm font-normal text-zinc-500">(optional)</span>
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" id={`${prefix}-name`}>
          <input
            id={`${prefix}-name`}
            type="text"
            className={inputClass}
            value={formData[`${prefix}Name`]}
            onChange={(e) => update({ [`${prefix}Name`]: e.target.value })}
          />
        </Field>
        <Field label="Title" id={`${prefix}-title`}>
          <input
            id={`${prefix}-title`}
            type="text"
            className={inputClass}
            value={formData[`${prefix}Title`]}
            onChange={(e) => update({ [`${prefix}Title`]: e.target.value })}
          />
        </Field>
      </div>

      <Field label="Company" id={`${prefix}-company`}>
        <input
          id={`${prefix}-company`}
          type="text"
          className={inputClass}
          value={formData[`${prefix}Company`]}
          onChange={(e) => update({ [`${prefix}Company`]: e.target.value })}
        />
      </Field>

      <Field label="Notice Address (email or postal)" id={`${prefix}-address`}>
        <input
          id={`${prefix}-address`}
          type="text"
          className={inputClass}
          value={formData[`${prefix}Address`]}
          onChange={(e) => update({ [`${prefix}Address`]: e.target.value })}
        />
      </Field>
    </>
  );
}

export default function NdaForm({ formData, onChange }: NdaFormProps) {
  function update(fields: Partial<NdaFormData>) {
    onChange({ ...formData, ...fields });
  }

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <h2 className="text-lg font-semibold text-zinc-900">
        Agreement Details
      </h2>

      <Field label="Purpose" id="purpose">
        <textarea
          id="purpose"
          className={inputClass + " min-h-[60px]"}
          value={formData.purpose}
          onChange={(e) => update({ purpose: e.target.value })}
        />
      </Field>

      <Field label="Effective Date" id="effective-date">
        <input
          id="effective-date"
          type="date"
          className={inputClass}
          value={formData.effectiveDate}
          onChange={(e) => update({ effectiveDate: e.target.value })}
        />
      </Field>

      <Field label="MNDA Term">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mndaTermType"
              checked={formData.mndaTermType === "expires"}
              onChange={() => update({ mndaTermType: "expires" })}
            />
            Expires after
            <input
              type="number"
              min="1"
              className="w-16 rounded border border-zinc-300 px-2 py-1 text-sm"
              value={formData.mndaTermYears}
              onChange={(e) => update({ mndaTermYears: e.target.value })}
              disabled={formData.mndaTermType !== "expires"}
            />
            year(s)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mndaTermType"
              checked={formData.mndaTermType === "until_terminated"}
              onChange={() => update({ mndaTermType: "until_terminated" })}
            />
            Continues until terminated
          </label>
        </div>
      </Field>

      <Field label="Term of Confidentiality">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="confidentialityTermType"
              checked={formData.confidentialityTermType === "years"}
              onChange={() => update({ confidentialityTermType: "years" })}
            />
            <input
              type="number"
              min="1"
              className="w-16 rounded border border-zinc-300 px-2 py-1 text-sm"
              value={formData.confidentialityTermYears}
              onChange={(e) =>
                update({ confidentialityTermYears: e.target.value })
              }
              disabled={formData.confidentialityTermType !== "years"}
            />
            year(s) (trade secrets protected longer)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="confidentialityTermType"
              checked={formData.confidentialityTermType === "perpetual"}
              onChange={() => update({ confidentialityTermType: "perpetual" })}
            />
            In perpetuity
          </label>
        </div>
      </Field>

      <Field label="Governing Law (State)" id="governing-law">
        <input
          id="governing-law"
          type="text"
          className={inputClass}
          placeholder="e.g., Delaware"
          value={formData.governingLaw}
          onChange={(e) => update({ governingLaw: e.target.value })}
        />
      </Field>

      <Field label="Jurisdiction" id="jurisdiction">
        <input
          id="jurisdiction"
          type="text"
          className={inputClass}
          placeholder='e.g., courts located in New Castle, DE'
          value={formData.jurisdiction}
          onChange={(e) => update({ jurisdiction: e.target.value })}
        />
      </Field>

      <Field label="MNDA Modifications" id="modifications">
        <textarea
          id="modifications"
          className={inputClass + " min-h-[60px]"}
          placeholder="List any modifications to the standard terms..."
          value={formData.modifications}
          onChange={(e) => update({ modifications: e.target.value })}
        />
      </Field>

      <hr className="border-zinc-200" />

      <PartyFields
        prefix="party1"
        label="Party 1"
        formData={formData}
        update={update}
      />

      <hr className="border-zinc-200" />

      <PartyFields
        prefix="party2"
        label="Party 2"
        formData={formData}
        update={update}
      />
    </form>
  );
}
