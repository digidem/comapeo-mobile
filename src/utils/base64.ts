import {Buffer} from 'buffer';

export const convertUrlToBase64 = async (url: string) => {
  const imageResponse = await fetch(url);
  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch image from ${url}`);
  }
  const imageType = imageResponse.headers.get('content-type');
  const arrayBuffer = await imageResponse.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  return `data:${imageType};base64,${base64}`;
};
