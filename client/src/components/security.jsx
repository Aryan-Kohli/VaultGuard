import CryptoJS from "crypto-js";

export function encryptFile(file, encryptionKey) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const fileContent = event.target.result; // ArrayBuffer
      const wordArray = CryptoJS.lib.WordArray.create(
        new Uint8Array(fileContent)
      ); // Binary to WordArray
      const encrypted = CryptoJS.AES.encrypt(
        wordArray,
        encryptionKey
      ).toString(); // Encrypt
      resolve(encrypted);
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsArrayBuffer(file); // Read file as binary data
  });
}

export function decryptFile(encryptedData, decryptionKey) {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, decryptionKey);
    const wordArray = decrypted.toString(CryptoJS.enc.Base64); // Convert to base64
    const decodedBytes = Uint8Array.from(atob(wordArray), (c) =>
      c.charCodeAt(0)
    ); // Base64 to Uint8Array
    return decodedBytes.buffer; // Return ArrayBuffer
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}
