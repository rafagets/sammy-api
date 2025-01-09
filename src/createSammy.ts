// Generaliza o tipo ResolvedApiResponse
export type ResolvedApiResponse<TModules> = {
  [K in keyof TModules]: Awaited<TModules[K]>;
};

export type TModules<T extends Record<string, Promise<any>>> = {
  [K in keyof T]: Awaited<T[K]>['default'];
};

export function createSammy<TModules>(server: Function): ResolvedApiResponse<TModules> {
  return new Proxy({} as ResolvedApiResponse<TModules>, {
    // @ts-ignore
    get(_, moduleKey: keyof TModules) {
      return new Proxy({}, {
        get(_, methodKey: string) {
          return (...args: any[]) =>
            server(
              moduleKey,
              methodKey as any,
              JSON.stringify(args),
            ); 
        }},
      );
    },
  });
}