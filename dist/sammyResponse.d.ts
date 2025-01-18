interface Props<T> {
    message: string;
    content?: T;
    title?: string;
    action?: string;
}
export interface PropsResult<T> {
    type: TType;
    message: string;
    content?: T;
    title?: string;
    action?: string;
}
export type TType = 'success' | 'error' | 'warning' | 'info';
export type SammyResponseDto<T> = Promise<PropsResult<T>>;
declare class ResponseModel<T> implements PropsResult<T> {
    type: TType;
    message: string;
    content?: T | undefined;
    title?: string | undefined;
    action?: string | undefined;
    constructor(type: TType, props: Props<T>);
}
export declare class SammyResponse {
    static success<T>(props: T, value?: any): ResponseModel<T>;
    static error<T>(props: (Props<T> & {
        httpError?: Error;
    }) | string, value?: T): (T & ResponseModel<any>) | ResponseModel<T>;
    static warning<T>(props: Props<T> | string, value?: T): ResponseModel<T>;
    static info<T>(props: Props<T> | string, value?: T): ResponseModel<T>;
}
export {};
//# sourceMappingURL=sammyResponse.d.ts.map