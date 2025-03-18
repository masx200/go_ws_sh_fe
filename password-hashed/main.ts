//@ts-ignore
document.getElementById("button").onclick = async () => {
    await generateHash();
};
//@ts-ignore
document.getElementById("generatepassword").onclick = async () => {
    await generatePassword();
};
import { generate32BytePassword } from "./generate32BytePassword.ts";
import { hashPasswordWithSalt } from "./hashPasswordWithSalt.ts";

async function generateHash() {
    //@ts-ignore
    let password = document.getElementById("password").value;
    //@ts-ignore
    const algorithm = document.getElementById("algorithm").value;

    if (!password) {
        //@ts-ignore
        password = document.getElementById("password").value =
            generate32BytePassword();
    }

    try {
        const result = await hashPasswordWithSalt(password, {
            algorithm,

            saltlength:
                "SHA-384" == algorithm ? 48 : "SHA-256" == algorithm ? 32 : 64,
        });
        //@ts-ignore
        document.getElementById("result").innerHTML = `
    <h3>Result:</h3>
    <p><strong>Algorithm:</strong> ${result.algorithm}</p>
     <p><strong>Password:</strong> ${password}</p>
    <p><strong>Salt (hex):</strong> ${result.salt}</p>
    <p><strong>Hash (hex):</strong> ${result.hash}</p>
`;
    } catch (error) {
        console.error("Hashing failed:", error);
        alert("Hashing process failed");
    }
}
function generatePassword() {
    //@ts-ignore
    document.getElementById("password").value = generate32BytePassword();
}
