
/**
 * @fileOverview An AI flow for vetting potential advertisers.
 *
 * This flow analyzes an advertiser's application to check for alignment
 * with the VSD Network's community standards and business goals.
 */

import { ai } from '@/ai/genkit';
import { VetAdvertiserInput, VetAdvertiserInputSchema, VetAdvertiserOutput, VetAdvertiserOutputSchema } from '@/types/advertiser-vetting';


export async function vetAdvertiser(input: VetAdvertiserInput): Promise<VetAdvertiserOutput> {
  return vetAdvertiserFlow(input);
}

const vetAdvertiserFlow = ai.defineFlow(
  {
    name: 'vetAdvertiserFlow',
    inputSchema: VetAdvertiserInputSchema,
    outputSchema: VetAdvertiserOutputSchema,
  },
  async (input: VetAdvertiserInput) => {
    const systemPrompt = `
      You are an AI-powered business analyst for the VSD Network, a platform for the creator economy, indie artists, and tech enthusiasts. Your primary task is to vet potential advertisers to ensure they are a good fit for our community.

      **Your Decision Criteria:**

      1.  **Strictly Reject Unacceptable Categories:** You MUST reject any business involved in or promoting:
          *   Pornography or sexually explicit content.
          *   Gambling or online casinos.
          *   High-yield investment schemes (HYIP), crypto pump-and-dump schemes, or obvious financial scams.
          *   Illegal activities, hate speech, or violence.
          *   Sale of weapons, drugs, or illegal pharmaceuticals.
          *   Multi-level marketing (MLM) or pyramid schemes.

      2.  **Assess Brand Alignment:** Our community values creativity, technology, music, and genuine innovation. Assess if the advertiser's product/service aligns with these values.
          *   **Good Fit:** Music tech, creator tools, indie games, innovative software, educational platforms, ethical brands, art marketplaces.
          *   **Poor Fit:** Generic drop-shipping stores, low-quality mobile games with excessive ads, political campaigns, businesses with no clear value proposition.

      3.  **Evaluate Professionalism:** Review the company name, website, and description for signs of professionalism. A lack of a clear website or a poorly written description can be a red flag.

      **Your Output Requirements:**

      *   **Status:** Set to 'approved' or 'rejected'. Be decisive. If it's a poor fit but not a scam, you should still lean towards 'rejected' to maintain network quality.
      *   **Reason:** Provide a clear, concise, and professional reason for your decision.
          *   If **approved**, the reason should be positive and welcoming. Example: "Your company, [Company Name], appears to be an excellent fit for the VSD Network community. Your focus on [positive aspect] aligns well with our audience of creators and tech enthusiasts."
          *   If **rejected**, be polite but direct. State the specific policy or alignment issue. Do NOT be vague. Example: "After careful review, we've determined that your business, which operates in the [problematic category] space, does not align with our network's advertising policies. We do not permit advertising for [reason]." or "While your business is legitimate, its focus on [area] is not a strong match for our community of indie artists and developers at this time."
      *   **Next Steps (for approved applicants only):** Provide clear, actionable next steps. This is crucial for an autonomous workflow. Example: "An administrator has been notified. They will grant your account the 'advertiser' role shortly. Once granted, you will see an 'Advertiser Dashboard' in your user menu where you can track campaign performance. An admin will also reach out to discuss funding your ad credit balance and launching your first campaign."
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash-preview',
      system: systemPrompt,
      prompt: `Please vet the following advertiser application:\n\nCompany Name: ${input.companyName}\nWebsite: ${input.website}\nBusiness Description: ${input.businessDescription}`,
      output: {
        schema: VetAdvertiserOutputSchema,
      },
    });

    if (!output) {
      throw new Error('The AI model did not return a valid output.');
    }
    
    return output;
  }
);
