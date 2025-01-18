export function createSammy(server) {
    return new Proxy({}, {
        // @ts-ignore
        get(_, moduleKey) {
            return new Proxy({}, {
                get(_, methodKey) {
                    return (...args) => server(moduleKey, methodKey, JSON.stringify(args));
                }
            });
        },
    });
}
