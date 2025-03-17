import { expect, test } from "vitest";
import { hashPasswordWithSalt } from "./hashPasswordWithSalt";
test("hashPasswordWithSalt", async () => {
    await hashPasswordWithSalt("pass").then((result) => {
        console.log(result.toString());
        // console.log("Hash:", result.hash);
        // // 长度128的十六进制字符串
        // console.log("Salt:", result.salt);
        // 长度32的十六进制字符串
    }, console.error);
});
