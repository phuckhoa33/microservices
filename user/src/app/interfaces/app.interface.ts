import {ValidationError} from 'class-validator';

export interface IMessageValidationError {
    property: string;
    message: string;
}

export interface IAppException {
    statusCode: number;
    message: string;
    errors?: IMessageValidationError[] | ValidationError[];
    data?: Record<string, any>;
}