export async function toUint8Array(
    input: ArrayBufferLike | Blob | ArrayBufferView,
) {
    if (input instanceof Uint8Array) {
        // 如果已经是 Uint8Array，直接返回
        return input;
    } else if (ArrayBuffer.isView(input)) {
        // 如果是其他类型的 ArrayBufferView（例如 Int8Array, Float32Array 等）
        return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    } else if (input instanceof ArrayBuffer) {
        // 如果是 ArrayBuffer
        return new Uint8Array(input);
    } else if (input instanceof Blob) {
        // 如果是 Blob
        const arrayBuffer = await input.arrayBuffer();
        return new Uint8Array(arrayBuffer);
    } else {
        throw new TypeError("Unsupported type: " + typeof input);
    }
}
