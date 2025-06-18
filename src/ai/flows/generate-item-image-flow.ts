
'use server';
/**
 * @fileOverview A flow to generate images for game items.
 *
 * - generateItemImage - A function that generates an image for a game item.
 * - GenerateItemImageInput - The input type for the generateItemImage function.
 * - GenerateItemImageOutput - The return type for the generateItemImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateItemImageInputSchema = z.object({
  itemName: z.string().describe('The name of the game item.'),
  itemCategory: z.string().describe('The category of the game item.'),
});
export type GenerateItemImageInput = z.infer<typeof GenerateItemImageInputSchema>;

const GenerateItemImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateItemImageOutput = z.infer<typeof GenerateItemImageOutputSchema>;

export async function generateItemImage(input: GenerateItemImageInput): Promise<GenerateItemImageOutput> {
  return generateItemImageFlow(input);
}

const promptTemplate = ai.definePrompt({
  name: 'generateItemImagePrompt',
  input: {schema: GenerateItemImageInputSchema},
  output: {schema: GenerateItemImageOutputSchema},
  prompt: `Generate a visually appealing icon or image suitable for a fantasy game item marketplace.
The item is named '{{itemName}}' and belongs to the category '{{itemCategory}}'.
The image should be in a style that fits a fantasy game, focusing on the item itself.
Ensure the item is clearly depicted. Do not include any text in the image.
Output the image as a data URI.`,
});


const generateItemImageFlow = ai.defineFlow(
  {
    name: 'generateItemImageFlow',
    inputSchema: GenerateItemImageInputSchema,
    outputSchema: GenerateItemImageOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', // Ensure this model supports image generation
      prompt: [
        {text: `Generate a visually appealing icon or image suitable for a fantasy game item marketplace. The item is named '${input.itemName}' and belongs to the category '${input.itemCategory}'. The image should be in a style that fits a fantasy game, focusing on the item itself. Ensure the item is clearly depicted. No text on the image.`}
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    
    if (!media?.url) {
      throw new Error('Image generation failed or did not return a media URL.');
    }
    
    return { imageDataUri: media.url };
  }
);
