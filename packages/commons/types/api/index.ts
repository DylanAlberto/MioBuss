export type Error = {
  code: string;
  fields?: { field: string; message: string }[];
  message: string;
};

export const codes = {
  ok: {
    code: 'Ok',
    message: 'Ok',
    statusCode: 200,
  },
  codeResent: {
    code: 'CodeResent',
    message: 'Code resent, please verify your email',
    statusCode: 200,
  },
  accountConfirmed: {
    code: 'AccountConfirmed',
    message: 'Account confirmed',
    statusCode: 200,
  },
  badRequest: {
    code: 'BadRequest',
    message: 'Bad request',
    statusCode: 400,
  },
  passwordNotMatch: {
    code: 'PasswordNotMatch',
    message: 'Password does not match',
    statusCode: 400,
  },
  unauthorized: {
    code: 'Unauthorized',
    message: 'Unauthorized',
    statusCode: 401,
  },
  invalidUserOrPassword: {
    code: 'InvalidUserOrPassword',
    message: 'Invalid user or password, please try again',
    statusCode: 401,
  },
  userNotConfirmed: {
    code: 'UserNotConfirmed',
    message: 'User is not confirmed',
    statusCode: 403,
  },
  serverError: {
    code: 'ServerError',
    message: 'Unexpected server error',
    statusCode: 500,
  },
};
