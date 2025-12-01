import HTTP_STATUS from './httpStatus';

export function mapError(error: unknown): {
  status: number;
  message: string;
} {
  // Se não for Error normal, tratamos como erro interno
  if (!(error instanceof Error)) {
    return {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }

  const msg = error.message;

  // 404 – recursos não encontrados
  if (msg === 'User not found' || msg === 'Vacation not found') {
    return {
      status: HTTP_STATUS.NOT_FOUND,
      message: msg,
    };
  }

  // 409 – conflitos de regra de negócio
  if (msg === 'Email already in use') {
    return {
      status: HTTP_STATUS.CONFLICT,
      message: msg,
    };
  }

  // 400 – erros de validação / regras de domínio
  const badRequestErrors = [
    'Invalid dates',
    'startDate must be before or equal to endDate',
    'Employee must have at least 12 months of work to request vacations',
    'Vacation period must be at least 5 days',
    'User already has a pending vacation request',
    'Requested days exceed available vacation days',
    'User does not have enough vacation days',
    'Only pending vacations can be approved',
    'Only pending vacations can be rejected',
    'Employee cannot have more than 3 vacation periods in the same cycle',
    'On the third vacation period, the total days in the cycle must complete exactly 30 days',
    'With this request, it will not be possible to have a 14-day vacation period in this cycle',
  ];

  if (badRequestErrors.includes(msg)) {
    return {
      status: HTTP_STATUS.BAD_REQUEST,
      message: msg,
    };
  }

  // fallback – erro interno
  return {
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
  };
}
