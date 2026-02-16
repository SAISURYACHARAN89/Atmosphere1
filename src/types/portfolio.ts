import { z } from "zod";

/* -------- Team Member -------- */
export const zTeamMember = z.object({
  id: z.number(),
  username: z.string().optional(),
  role: z.string().optional(),
  userId: z.string().optional(),
});

/* -------- Company Profile Form -------- */
export const zCompanyProfileForm = z.object({
  companyProfile: z.string().min(1, "Company name required"),
  about: z.string().optional(),
  location: z.string().optional(),
  companyType: z.string().optional(),
  selectedIndustries: z.array(z.string()).default([]),
  establishedOn: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  teamMembers: z.array(zTeamMember).default([]),
});

export type ZCompanyProfileForm =
  z.infer<typeof zCompanyProfileForm>;

export type ZTeamMember =
  z.infer<typeof zTeamMember>;
