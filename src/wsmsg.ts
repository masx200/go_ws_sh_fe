// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               v5.29.2
// source: wsmsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "go_ws_sh";

/** 定义一个消息类型 */
export interface wsmsg {
    /** 整数类型的字段 */
    type: number;
    /** 字节流类型的字段 */
    data: Uint8Array;
}

function createBasewsmsg(): wsmsg {
    return { type: 0, data: new Uint8Array(0) };
}

export const wsmsg: MessageFns<wsmsg> = {
    encode(
        message: wsmsg,
        writer: BinaryWriter = new BinaryWriter(),
    ): BinaryWriter {
        if (message.type !== 0) {
            writer.uint32(8).int32(message.type);
        }
        if (message.data.length !== 0) {
            writer.uint32(18).bytes(message.data);
        }
        return writer;
    },

    decode(input: BinaryReader | Uint8Array, length?: number): wsmsg {
        const reader = input instanceof BinaryReader
            ? input
            : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasewsmsg();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 8) {
                        break;
                    }

                    message.type = reader.int32();
                    continue;
                }
                case 2: {
                    if (tag !== 18) {
                        break;
                    }

                    message.data = reader.bytes();
                    continue;
                }
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skip(tag & 7);
        }
        return message;
    },

    fromJSON(object: any): wsmsg {
        return {
            type: isSet(object.type) ? globalThis.Number(object.type) : 0,
            data: isSet(object.data)
                ? bytesFromBase64(object.data)
                : new Uint8Array(0),
        };
    },

    toJSON(message: wsmsg): unknown {
        const obj: any = {};
        if (message.type !== 0) {
            obj.type = Math.round(message.type);
        }
        if (message.data.length !== 0) {
            obj.data = base64FromBytes(message.data);
        }
        return obj;
    },

    create<I extends Exact<DeepPartial<wsmsg>, I>>(base?: I): wsmsg {
        return wsmsg.fromPartial(base ?? ({} as any));
    },
    fromPartial<I extends Exact<DeepPartial<wsmsg>, I>>(object: I): wsmsg {
        const message = createBasewsmsg();
        message.type = object.type ?? 0;
        message.data = object.data ?? new Uint8Array(0);
        return message;
    },
};

function bytesFromBase64(b64: string): Uint8Array {
    if ((globalThis as any).Buffer) {
        return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
    } else {
        const bin = globalThis.atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; ++i) {
            arr[i] = bin.charCodeAt(i);
        }
        return arr;
    }
}

function base64FromBytes(arr: Uint8Array): string {
    if ((globalThis as any).Buffer) {
        return globalThis.Buffer.from(arr).toString("base64");
    } else {
        const bin: string[] = [];
        arr.forEach((byte) => {
            bin.push(globalThis.String.fromCharCode(byte));
        });
        return globalThis.btoa(bin.join(""));
    }
}

type Builtin =
    | Date
    | Function
    | Uint8Array
    | string
    | number
    | boolean
    | undefined;

export type DeepPartial<T> = T extends Builtin ? T
    : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
    : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
    : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
    :
        & P
        & { [K in keyof P]: Exact<P[K], I[K]> }
        & {
            [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
        };

function isSet(value: any): boolean {
    return value !== null && value !== undefined;
}

export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
    create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
    fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
