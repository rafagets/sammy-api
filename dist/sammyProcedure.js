import { SammyResponse } from './sammyResponse';
export class SammyProcedure {
    _guard;
    _scheme;
    currentUser;
    scheme(scheme) {
        this._scheme = scheme;
        return this;
    }
    protect(guard) {
        this._guard = guard;
        return this;
    }
    execute(callback) {
        return async (input) => {
            let validatedInput;
            if (this._guard) {
                this.currentUser = await this._guard.execute();
                if (!this.currentUser) {
                    const fallback = () => SammyResponse.error('Usuario nãoo logado');
                    return fallback();
                }
            }
            if (this._scheme) {
                try {
                    validatedInput = this._scheme.parse(input);
                }
                catch (err) {
                    const fallback = () => SammyResponse.error('Falha ao validar os dados', err?.errors);
                    return fallback();
                }
            }
            else {
                validatedInput = input;
            }
            try {
                return await callback(validatedInput, this.currentUser || {});
            }
            catch (e) {
                return SammyResponse.error('Tivemos um problema, Tente novamente', e?.message);
            }
        };
    }
}
export const sammyApi = new SammyProcedure();
