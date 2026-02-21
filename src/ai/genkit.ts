import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Initializes and exports the Genkit AI instance.
 * This instance is configured with the Google AI plugin.
 * 
 * The googleAI() plugin automatically reads GOOGLE_GENAI_API_KEY from process.env
 */
export const ai = genkit({
  plugins: [googleAI()],
  // As per Genkit v1.x guidelines, logLevel is not configured here.
  // If you need to enable flow state logging to .genkit/state/flow-state.json,
  // you might need a `genkit.config.ts` or other configuration method
  // as the `logLevel` option in `genkit()` constructor is deprecated.
  // For now, we'll stick to the minimal required setup.
});
