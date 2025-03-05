interface Props<T> {
  isSuccess?: boolean;
  message: string;
  content: T;
  title?: string;
  action?: string;
}

export interface PropsResult<T> {
  isSuccess?: boolean;
  type: TType;
  message: string;
  content: T;
  title?: string;
  action?: string;
}

export type TType = 'success' | 'error' | 'warning' | 'info';

export type SammyResponseDto<T> = Promise<PropsResult<T>>;

class ResponseModel<T> implements PropsResult<T> {
  isSuccess?: boolean;
  type: TType;
  message: string;
  content: T;
  title?: string | undefined;
  action?: string | undefined;
  constructor(type: TType, props: Props<T>) {
    this.isSuccess = props.isSuccess;
    this.type = type;
    this.message = props.message;
    this.content = props.content || '' as T;
    this.title = props.title;
    this.action = props.action;
  }
}

export class SammyResponse {
  public static success<T>(props: T, value?: any) {
    if (typeof props === 'string') {
      props = {
        message: props,
        content: value,
        isSuccess: true,
      } as any;
    }
    // verifica se a props é um objeto padrao de resposta ou é um conteudo direto
    else if (!['content', 'message'].every(key => Object.keys((props || {}) as any).includes(key))) {
      props = {
        message: 'success',
        content: props as T,
        isSuccess: true,
      } as any;
    }
    return new ResponseModel<T>('success', props as any);
  }

  public static error<T>(
    props: (Props<T> & { httpError?: Error }) | string | Error,
    value?: T
  ) {
    if (value instanceof ResponseModel) {
      return value;
    }

    if (props instanceof Error) {
      props = {
        message: props.message,
        content: 'error' as any,
      };
    }
    else if (typeof props === 'string' && value instanceof Error) {
      props = {
        message: props,
        content: value.message as any,
      };
    }
    else if (typeof props === 'string') {
      props = {
        message: props,
        content: value || '' as T,
      };
    }
    return new ResponseModel<T>('error', props as any);
  }

  public static warning<T>(props: Props<T> | string, value?: T) {
    if (typeof props === 'string') {
      props = {
        message: props,
        content: value || '' as T,
        isSuccess: false,
      };
    }
    return new ResponseModel<T>('warning', props);
  }

  public static info<T>(props: Props<T> | string, value?: T) {
    if (typeof props === 'string') {
      props = {
        message: props,
        content: value || '' as T,
        isSuccess: true,
      };
    }
    return new ResponseModel<T>('info', props);
  }
}