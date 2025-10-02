const firebaseEncryptedApiKey = "j7imVG6yXcamt9ZS6hYqQxdGZVXmg5C6zlaiOhAFqeujirnZo1itlbimeVcykIll2zgc1vAKiBQXcGM1Ia9wM4eEYJSdb9qGlRaQYWxNkSf6ds0="
const passwordHash = [16, -21, -25, -78, -24, -118, -123, 106, 55, 4, 43, 80, -6, -43, 62, -18, -104, -64, 72, -16, -22, -60, -113, 63, 98, -66, -79, -46, 74, -86, 85, -16]

function convertDatabaseInputToIntended(input) {
    return input.replace(/\{(\d+)\}/g, (_, asciiCode) => {
        return String.fromCharCode(Number(asciiCode));
    });
}

function get_year_range() {
    return "2025-2026"
}

function get_year() {
    return "2025"
}