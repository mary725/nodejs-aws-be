import Ajv from 'ajv';

import { CommonError } from './errors';

export const bodyValidator = ({ schema }) => {
    const ajv = new Ajv({ allErrors: true });

    const validateInput = schema ? ajv.compile(schema) : null;

    return {
        before (handler, next) {
            if (!schema) {
                return next();
            }

            const valid = validateInput(handler.event.body);
            if (!valid) {
                console.error(validateInput.errors);
                const error = validateInput.errors[0];
                const propName = error.instancePath.split('/').pop();
                throw new CommonError(`${propName} ${error.message}`, 400);
            }

            return next();
        }
    }
};
