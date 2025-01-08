export function compressData(data: Uint8Array): Uint8Array {
    const compressedData = pako.gzip(data);
    return compressedData;
}
import pako from "pako";
export function decompressData(data: Uint8Array): Uint8Array {
    const compressedData = pako.ungzip(data);
    return compressedData;
}
