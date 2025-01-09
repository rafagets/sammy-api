class ResponseModel {
    type;
    message;
    content;
    title;
    action;
    constructor(type, props) {
        this.type = type;
        this.message = props.message;
        this.content = props.content;
        this.title = props.title;
        this.action = props.action;
    }
}
export class SammyResponse {
    static success(props, value) {
        if (typeof props === 'string') {
            props = {
                message: props,
                content: value,
            };
        }
        // verifica se a props é um objeto padrao de resposta ou é um conteudo direto
        else if (!['content', 'message'].every(key => Object.keys((props || {})).includes(key))) {
            props = {
                message: 'success',
                content: props,
            };
        }
        return new ResponseModel('success', props);
    }
    static error(props, value) {
        if (value instanceof ResponseModel) {
            return value;
        }
        if (typeof props === 'string' && value instanceof Error) {
            props = {
                message: props,
                content: value.message,
            };
        }
        else if (typeof props === 'string') {
            props = {
                message: props,
                content: value,
            };
        }
        return new ResponseModel('error', props);
    }
    static warning(props, value) {
        if (typeof props === 'string') {
            props = {
                message: props,
                content: value,
            };
        }
        return new ResponseModel('warning', props);
    }
    static info(props, value) {
        if (typeof props === 'string') {
            props = {
                message: props,
                content: value,
            };
        }
        return new ResponseModel('info', props);
    }
}
