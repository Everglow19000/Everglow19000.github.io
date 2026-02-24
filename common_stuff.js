const firebaseEncryptedApiKey = "W25MYL2p9bPLfZrVxB7QhWMB7BDtCxJUf1vNTk5II1hbGCer7mG0J/nwSqZ3ik0XaZtCeoETJg7PyDRwI1eXO2wlLar2vJdOB0eHH3qcXWcnSwI="
const passwordHash = "5f834b8ed4bdd57e751b12ccfae02511b070eac54b9002e9a4d6646dcf0ed6dc"

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