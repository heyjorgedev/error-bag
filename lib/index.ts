import { validate as validateTypescript } from 'validate-typescript'
import { ErrorBag } from './error-bag';
import { flattenDeep } from 'lodash'
export * from 'validate-typescript'
export * from './error-bag'

export async function validate<T>(schema: unknown, data: T, name?: string, log?: any) {
  const bag = new ErrorBag(data);

  try {
    await validateTypescript(schema, data, name, log)
  } catch(e) {
    const errors = transformErrors(e)
    errors.forEach(error => bag.set(error.path, error.errors))
  }

  return bag;
}

function transformErrors(e: any): Array<{path:string, errors: string[]}> {
  const errors = e.child_errors.map(getChildError);
  return flattenDeep<Array<{path:string, errors: string[]}>>(errors);
}

function getChildError(error: any) {
  if (error.child_errors) {
    return error.child_errors.map(getChildError)
  }

  return {
    path: error.property.replace(/./, ''),
    errors: getErrorsArray(error)
  }
}

function getErrorsArray(error: any) {
  const childErrors = error.child_error.child_errors;

  if (childErrors && childErrors.length > 0) {
    return childErrors.map((childError: any) => childError.validator)
  }

  return [ error.validator ]
}
