const encoder = new TextEncoder();
const decoder = new TextDecoder();
const toBase64 = buffer => btoa(String.fromCharCode(...new Uint8Array(buffer)));
const fromBase64 = buffer => Uint8Array.from(atob(buffer), c => c.charCodeAt(0));


const generateKey = async (passphrase, salt, iterations) => {
  // Encodes passphrase string as unsigned 8-bit integer array.
  const keyMaterial = await window.crypto.subtle.importKey('raw', encoder.encode(passphrase), {name: 'PBKDF2'}, false, ['deriveKey']);
  return await window.crypto.subtle.deriveKey(
      // Algorithm is a Pbkdf2Params object.
      { name: 'PBKDF2', hash: 'SHA-256', salt: salt, iterations: iterations}, 
      // Base key is imported from passphrase.
      keyMaterial, 
      // AesKeyGenParams object.
      { name: "AES-GCM", length: 256 }, false, ['encrypt', 'decrypt']
    );
}

export const encryptString = async (toBeEncrypted, passphrase) => {
  if (!passphrase) return toBeEncrypted;
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(16));
  const key = await generateKey(passphrase, salt, 100000);
  const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, encoder.encode(toBeEncrypted));
  return toBase64([...salt, ...iv, ...new Uint8Array(encrypted)]);
}

export const decryptString = async (toBeDecrypted, passphrase) => {
  if (!passphrase) return toBeDecrypted;
  const encrypted = fromBase64(toBeDecrypted);
  const salt = encrypted.slice(0, 16);
  const iv = encrypted.slice(16, 32);
  const key = await generateKey(passphrase, salt, 100000);
  let decrypted = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, encrypted.slice(32));
  return decoder.decode(decrypted);
}