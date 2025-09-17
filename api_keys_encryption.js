async function SHA_256(input) {
    return await crypto.subtle.digest("SHA-256", base64ToInt8Array(input)).then(
        (hashBuffer) => {
            const hashArray = Array.from(new Int8Array(hashBuffer))
            return hashArray
        }
    )
}

function base64ToInt8Array(base64String) {
    base64String += "=".repeat((4 - base64String.length % 4) % 4)
    // 1. Decode the Base64 string into a binary string
    //    atob() treats the input as Base64 and returns a string where each character's
    //    Unicode value corresponds to the byte value of the original binary data.
    const binaryString = atob(base64String);

    // 2. Create a int8Array with the same length as the binary string
    const int8Array = new Int8Array(binaryString.length);

    // 3. Populate the int8Array by iterating through the binary string
    //    and getting the character code (byte value) of each character.
    for (let i = 0; i < binaryString.length; i++) {
        int8Array[i] = binaryString.charCodeAt(i);
    }

    return int8Array;
}

const ITERATIONS = 100_000;
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

async function decryptApiKey(password, encryptedKey, tagLengthIn = TAG_LENGTH, ivLengthIn = IV_LENGTH, keyLengthIn = KEY_LENGTH, iterationsIn = ITERATIONS) {
    var combined = base64ToInt8Array(encryptedKey)

    var salt, iv, encrypted

    salt = combined.slice(0, tagLengthIn)
    iv = combined.slice(tagLengthIn, tagLengthIn + ivLengthIn)
    encrypted = combined.slice(tagLengthIn + ivLengthIn, combined.length)

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