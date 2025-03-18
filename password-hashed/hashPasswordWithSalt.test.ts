import { expect, test } from "vitest";
import { hashPasswordWithSalt, type Options } from "./hashPasswordWithSalt";

test("hashPasswordWithSalt with SHA-256", async () => {
    const options: Options = { algorithm: "SHA-256", saltlength: 32 };
    await hashPasswordWithSalt("pass", options).then((result) => {
        console.log(result.toString());
        expect(result.algorithm).toBe("SHA-256");
    }, console.error);
});

test("hashPasswordWithSalt with SHA-384", async () => {
    const options: Options = { algorithm: "SHA-384", saltlength: 48 };
    await hashPasswordWithSalt("pass", options).then((result) => {
        console.log(result.toString());
        expect(result.algorithm).toBe("SHA-384");
    }, console.error);
});

// 原有的测试用例可以保留，也可以根据需要进行调整
test("hashPasswordWithSalt", async () => {
    await hashPasswordWithSalt("pass").then((result) => {
        console.log(result.toString());
        // console.log("Hash:", result.hash);
        // // 长度128的十六进制字符串
        // console.log("Salt:", result.salt);
        // 长度32的十六进制字符串
        expect(result.algorithm).toBe("SHA-512");
    }, console.error);
});

// 原有的测试用例可以保留，也可以根据需要进行调整
test("hashPasswordWithSalt with SHA-512", async () => {
    await hashPasswordWithSalt("pass").then((result) => {
        console.log(result.toString());
        // console.log("Hash:", result.hash);
        // // 长度128的十六进制字符串
        // console.log("Salt:", result.salt);
        // 长度32的十六进制字符串
        expect(result.algorithm).toBe("SHA-512");
    }, console.error);
});
