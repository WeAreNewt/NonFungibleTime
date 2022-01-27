export class Matic {
  readonly name = 'Matic' as const;
  readonly decimals = 18 as const;
  readonly symbol = 'MATIC';
}

export const matic = new Matic();
