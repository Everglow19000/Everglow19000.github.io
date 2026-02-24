async function SHA_256(password) {
    const msgUint8 = new TextEncoder().encode(password);      // 1. Encode to bytes
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // 2. Hash it
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // 3. Convert to array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // 4. Hex string
    return hashHex;
}

function base64ToUint8Array(base64String) {
    // This adds the correct number of '=' characters (0, 1, or 2) 
    // to satisfy atob's strict length-multiple-of-4 requirement.
    const padded = base64String.padEnd(base64String.length + (4 - base64String.length % 4) % 4, '=');
    const binaryString = atob(padded);
    return Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
}

const ITERATIONS = 100_000;
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

async function decryptApiKey(password, encryptedKey, tagLengthIn = TAG_LENGTH, ivLengthIn = IV_LENGTH, keyLengthIn = KEY_LENGTH, iterationsIn = ITERATIONS) {
    var data = base64ToUint8Array(encryptedKey)

    var salt, iv, encrypted

    salt = data.slice(0, tagLengthIn)
    iv = data.slice(tagLengthIn, tagLengthIn + ivLengthIn)
    encrypted = data.slice(tagLengthIn + ivLengthIn, data.length)

    const passwordBuffer = new TextEncoder().encode(password)

    const passwordKey = await crypto.subtle.importKey(
        "raw",
        passwordBuffer,
        "PBKDF2",
        false,
        ["deriveKey"]
    )

    const derivedKey = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: iterationsIn,
            hash: "SHA-256"
        },
        passwordKey,
        {
            name: "AES-GCM",
            length: keyLengthIn
        },
        false,
        ["decrypt"]
    )

    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        derivedKey,
        encrypted
    )

    return new TextDecoder().decode(decrypted)
}