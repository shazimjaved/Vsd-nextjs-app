
/**
 * @fileOverview An AI flow for generating images from text hints.
 *
 * - generateImageFromHint - A function that generates an image based on a textual hint.
 * - GenerateImageInput - The input type for the generateImageFromhinthint function.
 * - GenerateImageOutput - The return type for the generateImageFromHint function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateImageInputSchema = z.object({
  hint: z.string().describe('A textual hint to guide the image generation process.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI (e.g., 'data:image/png;base64,...')."),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImageFromHint(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFromHintFlow(input);
}

const generateImageFromHintFlow = ai.defineFlow(
  {
    name: 'generateImageFromHintFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input: GenerateImageInput) => {
    if (!input.hint) {
      console.warn('[AI_GEN_VALIDATION_FAIL] Image generation hint cannot be empty.');
      throw new Error('Image generation hint cannot be empty.');
    }

    try {
      // Use the ai instance which already has googleAI configured
      const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `Generate a photorealistic, visually appealing image based on the following hint: "${input.hint}". The image should be suitable for a professional website.`,
      });

      if (!media || !media.url) {
        console.error('[AI_GEN_EMPTY_RESPONSE] AI model did not return media or media.url.', { hint: input.hint });
        throw new Error(`Image generation failed for hint "${input.hint}": No media content returned.`);
      }
      
      return { imageDataUri: media.url };

    } catch (error: any) {
      console.error('[AI_GEN_FAILURE] An error occurred in the image generation flow.', {
        hint: input.hint,
        errorMessage: error.message,
        errorStack: error.stack,
      });
      // Re-throw a user-friendly error to be caught by the client
      throw new Error(`Failed to generate image from hint "${input.hint}". Please check server logs for details.`);
    }
  }
);
