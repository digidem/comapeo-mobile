import {Buffer} from 'buffer';

export const convertUrlToBase64 = async (url: string) => {
  const imageResponse = await fetch(url);
  const imageType = imageResponse.headers.get('content-type');
  const arrayBuffer = await imageResponse.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  return `data:${imageType};base64,${base64}`;
};
