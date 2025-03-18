import { debounce } from "lodash-es";
import { generate32BytePassword } from "./generate32BytePassword.ts";
import { hashPasswordWithSalt } from "./hashPasswordWithSalt.ts";
const debouncedGenerateHash = debounce(async function () {
  //@ts-ignore
  let password = document.getElementById("password").value;
  //@ts-ignore
  const algorithm = document.getElementById("algorithm").value;

  if (!password) {
    //@ts-ignore
    password =
      //@ts-ignore
      document.getElementById("password").value =
        generate32BytePassword();
  }

  try {
    const result = await hashPasswordWithSalt(password, {
      algorithm,
      saltlength: "SHA-384" == algorithm
        ? 48
        : "SHA-256" == algorithm
        ? 32
        : 64,
    });
    // 修改 HTML 模板为表格形式，并居中显示
    //@ts-ignore
    document.getElementById("result").innerHTML = `
            <table class="table table-bordered border-primary" style="margin: 0 auto; border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <th>参数</th>
                        <th>值</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Algorithm:</strong></td>
                        <td>${result.algorithm}</td>
                    </tr>
                    <tr>
                        <td><strong>Password:</strong></td>
                        <td>${password}</td>
                    </tr>
                    <tr>
                        <td><strong>Salt (hex):</strong></td>
                        <td>${result.salt}</td>
                    </tr>
                    <tr>
                        <td><strong>Hash (hex):</strong></td>
                        <td>${result.hash}</td>
                    </tr>
                </tbody>
            </table>
        `;
  } catch (error) {
    console.error("Hashing failed:", error);
    alert("Hashing process failed");
  }
});

const generatePassword = debounce(async function () {
  //@ts-ignore
  document.getElementById("password").value = generate32BytePassword();
  await debouncedGenerateHash();
});

document.addEventListener("DOMContentLoaded", function () {
  //@ts-ignore
  document.getElementById("button").onclick = async () => {
    await debouncedGenerateHash();
  };
  //@ts-ignore
  document.getElementById("generatepassword").onclick = async () => {
    await generatePassword();
  };
  //@ts-ignore
  document.getElementById("password").oninput = async () => {
    //@ts-ignore

    if (document.getElementById("password")?.value.length > 0) {
      await debouncedGenerateHash();
    }
  };
  //@ts-ignore
  document.getElementById("password").onchange = async () => {
    //@ts-ignore
    if (document.getElementById("password")?.value.length > 0) {
      await debouncedGenerateHash();
    }
  };
}, { once: true });
