import { z, ZodObject, ZodTypeAny } from 'zod';
import { ISammyGuard } from './sammyGuard';
import { SammyResponse } from './sammyResponse';

type TInput<T> = T extends ZodTypeAny ? z.infer<T> : any;
type TReturn<R> = R | Promise<R>;
type TIsUndefined<T> = T extends ZodObject<any> ? TInput<T> : undefined;

export class SammyProcedure<T extends ZodTypeAny, Y> {
  private _guard?: ISammyGuard<Y>;
  private _scheme?: ZodObject<any>;
  public currentUser?: Y;

  public scheme<U extends ZodObject<any>>(scheme: U) {
    this._scheme = scheme;
    return this as unknown as SammyProcedure<U, Y>;
  }

  public protect(guard: ISammyGuard<Y>) {
    this._guard = guard;
    return this;
  }

  public execute<R>(callback: (input: TIsUndefined<T>, user: any) => TReturn<R>) {
    return async (input?: TIsUndefined<T>) => {
      let validatedInput;

      if (this._guard) {
        this.currentUser = await this._guard.execute();
        if (!this.currentUser) {
          const fallback = () => SammyResponse.error('Usuario nãoo logado');
          return fallback() as TReturn<R>;
        }
      }

      if (this._scheme) {
        try {
          validatedInput = this._scheme.parse(input);
        } catch (err: any) {
          const fallback = () => SammyResponse.error('Falha ao validar os dados', err?.errors);
          return fallback() as TReturn<R>;
        }
      } else {
        validatedInput = input;
      }

      try {
        return await callback(validatedInput as any, this.currentUser || {} as Y);
      } catch (e: any) {
        return SammyResponse.error(e) as TReturn<R>;
      }
    };
  }
}

export const sammyApi = new SammyProcedure();
