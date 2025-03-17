async function hashPasswordWithSalt(password:string, algorithm='SHA-512', saltlength=64) {
    // 1. 生成16字节的随机盐值 [[2]][[4]]
    const salt = new Uint8Array(saltlength);
    window.crypto.getRandomValues(salt);

    // 2. 将密码转换为UTF-8字节数组 [[7]]
    const encoder = new TextEncoder();
    const passwordBytes = encoder.encode(password);

    // 3. 合并盐值和密码（盐值在前，密码在后）[[4]]
    const merged = new Uint8Array(salt.length + passwordBytes.length);
    merged.set(salt);
    merged.set(passwordBytes, salt.length);

    // 4. 计算SHA-512哈希 [[5]][[7]]
    const hashBuffer = await crypto.subtle.digest(algorithm, merged);

    // 5. 转换为十六进制字符串 [[3]][[10]]

    return {
        hash: toHex(hashBuffer),
        // 64字节的哈希值（SHA-512输出512位=64字节）
        salt: toHex(salt),
        algorithm // 16字节的盐值
    };
}
function toHex(buffer:ArrayBuffer|Uint8Array) {
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// 使用示例
hashPasswordWithSalt("pass").then(result => {

    console.log(result)
    // console.log("Hash:", result.hash);
    // // 长度128的十六进制字符串
    // console.log("Salt:", result.salt);
    // 长度32的十六进制字符串
}
, console.error);
export { hashPasswordWithSalt };
export { toHex };