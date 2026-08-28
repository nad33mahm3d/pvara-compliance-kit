/**
 * KYC / CDD field schemas — data shape only, no identity verification.
 * Not legal advice. See DISCLAIMER.md.
 */

import { z } from "zod";

export const riskRatingSchema = z.enum(["low", "medium", "high"]);

export const pepStatusSchema = z.object({
  isPep: z.boolean(),
  pepDetails: z.string().optional(),
  isRelatedToPep: z.boolean().optional(),
});

export const addressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  /** ISO 3166-1 alpha-2 */
  country: z.string().length(2),
});

export const individualKycSchema = z.object({
  fullName: z.string().min(1),
  /** Pakistani CNIC (formatted or digits) and/or passport number. */
  cnic: z.string().optional(),
  passportNumber: z.string().optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  nationality: z.string().length(2),
  address: addressSchema,
  sourceOfFunds: z.string().min(1),
  sourceOfWealth: z.string().optional(),
  pep: pepStatusSchema,
  riskRating: riskRatingSchema,
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const beneficialOwnerSchema = z.object({
  fullName: z.string().min(1),
  nationality: z.string().length(2).optional(),
  ownershipPercentage: z.number().min(0).max(100).optional(),
  controlDescription: z.string().optional(),
  cnic: z.string().optional(),
  passportNumber: z.string().optional(),
  pep: pepStatusSchema.optional(),
});

export const entityKycSchema = z.object({
  legalName: z.string().min(1),
  tradingName: z.string().optional(),
  registrationNumber: z.string().min(1),
  jurisdictionOfIncorporation: z.string().length(2),
  registeredAddress: addressSchema,
  businessAddress: addressSchema.optional(),
  sourceOfFunds: z.string().min(1),
  pep: pepStatusSchema.optional(),
  riskRating: riskRatingSchema,
  beneficialOwners: z.array(beneficialOwnerSchema).min(1),
});

export const kycRecordSchema = z.discriminatedUnion("type", [
  individualKycSchema.extend({ type: z.literal("individual") }),
  entityKycSchema.extend({ type: z.literal("entity") }),
]);

export type IndividualKyc = z.infer<typeof individualKycSchema>;
export type EntityKyc = z.infer<typeof entityKycSchema>;
export type KycRecord = z.infer<typeof kycRecordSchema>;
export type RiskRating = z.infer<typeof riskRatingSchema>;
