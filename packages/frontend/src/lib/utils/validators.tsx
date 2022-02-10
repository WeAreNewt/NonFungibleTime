
type RequiredFunc = (value: string | number) => string | undefined
export const required : RequiredFunc = (value) => value ? undefined : "Required";

type GreaterThanFunc = (min: number) => (value: number) => string | undefined
export const greaterThan : GreaterThanFunc = min => value => value > min ? undefined : `Must be greater than ${min}`;

export const greaterThanOrEqualTo : GreaterThanFunc = min => value => value >= min ? undefined : `Must be greater than or equal to ${min}`

type InBetween = (min: number, max: number) => (value: number) => string | undefined
export const inBetween : InBetween = (min, max) => value => value >= min &&  value <= max ? undefined : `Must be between ${min} and ${max}`;

type ValidateDate = (availabilityFrom : number, availabilityTo : number, duration : number) => string | undefined
export const validateDate : ValidateDate = (availabilityFrom, availabilityTo, duration) =>
  availabilityTo === 0 ||
  availabilityFrom === 0 ||
  (availabilityTo > availabilityFrom &&
    duration * 3600 <= availabilityTo - availabilityFrom)
  ?
    undefined :
    "availabilityTo must be greater than availablilityFrom + duration"