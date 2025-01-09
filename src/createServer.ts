import { ResolvedApiResponse } from "./createSammy";

declare global {
  var cache: any;
}

// Inicializando o cache se não existir
if (!globalThis.cache) {
  globalThis.cache = {} as any;
}

// Tempo de vida do cache (TTL) em milissegundos, aqui configurado para 1 hora (3600000 ms)
const CACHE_TTL = process.env.NODE_ENV === 'development' ? 0 : 3600000; 

async function _api<TModules, K extends keyof ResolvedApiResponse<TModules>>(imports: TModules, keyModule: K): Promise<ResolvedApiResponse<TModules>[K]> {
  const cachedEntry = globalThis.cache[keyModule];

  const now = Date.now();

  // Verifica se o módulo está no cache e se ainda não expirou
  if (cachedEntry && cachedEntry.expiration > now) {
    return cachedEntry.data;
  }

  // Carrega o módulo se ele não estiver no cache ou se tiver expirado
  const data: any = ((await imports[keyModule]) as any).default;

  // Armazena no cache com um tempo de expiração
  globalThis.cache[keyModule] = {
    data,
    expiration: now + CACHE_TTL, // Define a nova expiração com base no TTL
  };

  return data as ResolvedApiResponse<TModules>[K];
}

export async function createServer<TModules>(
  imports: TModules,
  ...[keyModule, method, args]: any
): Promise<any> {
  const requiredModule: any = await _api(imports, keyModule);

  if (typeof requiredModule[method] !== 'function') {
    throw new Error(`Method ${String(method)} does not exist on module ${String(keyModule)}`);
  }

  // Tipagem adequada dos argumentos
  // @ts-ignore
  const result = await requiredModule[method](...JSON.parse(args));

  return JSON.parse(JSON.stringify(result));
}