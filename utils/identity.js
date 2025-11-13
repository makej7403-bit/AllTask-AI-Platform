// utils/identity.js
export const CREATOR = 'Akin S. Sokpah from Nimba County, Liberia';

export function embedIdentity(text) {
  return `${text}\n\n— Platform created by ${CREATOR}`;
}
