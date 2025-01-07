declare class ZmodemSentry {
    consume(input: number[] | ArrayBuffer): void;
    constructor(options: {
        to_terminal: Function;
        on_detect: Function;
        on_retract: Function;
        sender: Function;
    }): ZmodemSentry;
}
declare class ZmodemSession {}
declare class Detection {}
declare class Offer {}
declare class Browser {}
declare const ZMLIB = {};
declare const ENCODELIB = {};
declare const CRC = {};
declare const Text = {};
declare const Validation = {};
declare const DEBUG: boolean;
declare class ZDLE {}
declare class Error {}
declare class Header {}
declare class Subpacket {}
export {
    Browser,
    CRC,
    Detection,
    ENCODELIB,
    Error,
    Header,
    Offer,
    Subpacket,
    Text,
    Validation,
    ZDLE,
    ZMLIB,
    ZmodemSentry as Sentry,
    ZmodemSession as Session,
};
