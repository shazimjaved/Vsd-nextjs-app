
import { z } from 'zod';

export const VetAdvertiserInputSchema = z.object({
  companyName: z.string().describe('The name of the applicant company.'),
  website: z.string().url().describe('The official website of the company.'),
  businessDescription: z.string().describe('A detailed description of the business, its products/services, and its advertising goals.'),
});
export type VetAdvertiserInput = z.infer<typeof VetAdvertiserInputSchema>;

export const VetAdvertiserOutputSchema = z.object({
  status: z.enum(['approved', 'rejected']).describe('The verdict of the vetting process. "approved" if the business is a good fit, "rejected" if it violates policies or is not a good fit.'),
  reason: z.string().describe('A concise, professional, and clear justification for the decision. This will be shown to the applicant.'),
  nextSteps: z.string().describe('Clear, actionable next steps for the applicant if they are approved. This should guide them on how to get their first campaign running. If rejected, this can be a generic closing statement.'),
});
export type VetAdvertiserOutput = z.infer<typeof VetAdvertiserOutputSchema>;


export const AdvertiserApplicationSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters."),
  website: z.string().url("Please enter a valid website URL."),
  businessDescription: z.string().min(50, "Description must be at least 50 characters.").max(1500, "Description cannot exceed 1500 characters."),
});

export type AdvertiserApplicationFormValues = z.infer<typeof AdvertiserApplicationSchema>;
