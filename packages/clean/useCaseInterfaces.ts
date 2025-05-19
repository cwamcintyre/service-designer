export interface requestResponse<Trequest, Tresponse> {
    request: Trequest;
    response: Tresponse;
    execute: (request: Trequest) => Promise<Tresponse>;
}

export interface requestVoid<Trequest> {
    request: Trequest;
    execute: (request: Trequest) => Promise<void>;
}

export interface voidResponse<Tresponse> {
    response: Tresponse;
    execute: () => Promise<Tresponse>;
}