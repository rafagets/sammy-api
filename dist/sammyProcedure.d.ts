import { z, ZodObject, ZodTypeAny } from 'zod';
import { ISammyGuard } from './sammyGuard';
type TInput<T> = T extends ZodTypeAny ? z.infer<T> : any;
type TReturn<R> = R | Promise<R>;
type TIsUndefined<T> = T extends ZodObject<any> ? TInput<T> : undefined;
export declare class SammyProcedure<T extends ZodTypeAny, Y> {
    private _guard?;
    private _scheme?;
    currentUser?: Y;
    scheme<U extends ZodObject<any>>(scheme: U): SammyProcedure<U, Y>;
    protect(guard: ISammyGuard<Y>): this;
    execute<R>(callback: (input: TIsUndefined<T>, user: any) => TReturn<R>): (input?: TIsUndefined<T>) => Promise<any>;
}
export declare const sammyApi: SammyProcedure<z.ZodTypeAny, unknown>;
export {};
//# sourceMappingURL=sammyProcedure.d.ts.map