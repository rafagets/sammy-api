export type ResolvedApiResponse<TModules> = {
    [K in keyof TModules]: Awaited<TModules[K]>;
};
export type TModules<T extends Record<string, Promise<any>>> = {
    [K in keyof T]: Awaited<T[K]>['default'];
};
export declare function createSammy<TModules>(server: Function): ResolvedApiResponse<TModules>;
//# sourceMappingURL=createSammy.d.ts.map