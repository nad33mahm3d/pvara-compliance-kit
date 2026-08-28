/**
 * Travel Rule payload schemas (FATF Recommendation 16 / Act Section 47 aligned).
 *
 * Structuring and validation only — not a certified Travel Rule network client.
 * Threshold amounts are caller-supplied; never treated as permanent law.
 * See DISCLAIMER.md.
 */

import { z } from "zod";

/** Natural person name fields commonly required under R.16 / IVMS-101-style payloads. */
export const personNameSchema = z.object({
  primaryIdentifier: z.string().min(1, "primaryIdentifier is required"),
  secondaryIdentifier: z.string().optional(),
});

export const geographicAddressSchema = z.object({
  addressType: z.enum(["HOME", "BIZZ", "GEOG", "MISC"]).optional(),
  department: z.string().optional(),
  subDepartment: z.string().optional(),
  streetName: z.string().optional(),
  buildingNumber: z.string().optional(),
  buildingName: z.string().optional(),
  floor: z.string().optional(),
  postBox: z.string().optional(),
  room: z.string().optional(),
  postCode: z.string().optional(),
  townName: z.string().optional(),
  townLocationName: z.string().optional(),
  districtName: z.string().optional(),
  countrySubDivision: z.string().optional(),
  /** ISO 3166-1 alpha-2 */
  country: z.string().length(2).optional(),
  addressLine: z.array(z.string()).optional(),
});

export const nationalIdentificationSchema = z.object({
  nationalIdentifier: z.string().min(1),
  nationalIdentifierType: z.enum([
    "ARNU",
    "CCPT",
    "RAID",
    "DRLC",
    "FIIN",
    "TXID",
    "SOCS",
    "IDCD",
    "MISC",
  ]),
  countryOfIssue: z.string().length(2).optional(),
  registrationAuthority: z.string().optional(),
});

export const dateAndPlaceOfBirthSchema = z.object({
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  placeOfBirth: z.string().optional(),
});

export const originatorPersonSchema = z.object({
  name: personNameSchema,
  accountNumber: z.string().min(1, "wallet/account identifier is required"),
  geographicAddress: geographicAddressSchema.optional(),
  nationalIdentification: nationalIdentificationSchema.optional(),
  dateAndPlaceOfBirth: dateAndPlaceOfBirthSchema.optional(),
  countryOfResidence: z.string().length(2).optional(),
  customerIdentification: z.string().optional(),
});

export const originatorLegalPersonSchema = z.object({
  name: personNameSchema,
  accountNumber: z.string().min(1),
  geographicAddress: geographicAddressSchema.optional(),
  nationalIdentification: nationalIdentificationSchema.optional(),
  countryOfRegistration: z.string().length(2).optional(),
  customerIdentification: z.string().optional(),
});

export const beneficiaryPersonSchema = originatorPersonSchema;
export const beneficiaryLegalPersonSchema = originatorLegalPersonSchema;

export const vaspInfoSchema = z.object({
  legalPersonName: z.string().min(1),
  lei: z.string().optional(),
  geographicAddress: geographicAddressSchema.optional(),
});

/**
 * Originator + beneficiary Travel Rule payload (natural or legal person parties).
 */
export const travelRulePayloadSchema = z.object({
  originator: z.union([originatorPersonSchema, originatorLegalPersonSchema]),
  beneficiary: z.union([beneficiaryPersonSchema, beneficiaryLegalPersonSchema]),
  originatingVasp: vaspInfoSchema.optional(),
  beneficiaryVasp: vaspInfoSchema.optional(),
  /** Optional transfer / message identifier for correlation. */
  transferId: z.string().optional(),
  asset: z
    .object({
      symbol: z.string().optional(),
      ledgerAddress: z.string().optional(),
    })
    .optional(),
});

export type TravelRulePayload = z.infer<typeof travelRulePayloadSchema>;
export type OriginatorPerson = z.infer<typeof originatorPersonSchema>;
export type BeneficiaryPerson = z.infer<typeof beneficiaryPersonSchema>;
