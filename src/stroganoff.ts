export interface StroganoffOptions {
  uuid?: boolean
  numbers?: number
  upper?: number
  minLen?: number
  maxLen?: number
  special?: number
  validMessage?: string
  invalidMessage?: string
  specific?: boolean
}

interface Specific {
  uuid?: boolean
  minLen?: boolean
  maxLen?: boolean
  numbers?: boolean
  upper?: boolean
  special?: boolean
}

export interface StroganoffResult {
  valid: boolean
  message: string
  specific?: Specific
}

// Regular expression to check if string is a valid UUID
const uuidRegex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/

export default class Stroganoff {
  expression: RegExp
  upperExpression: RegExp
  specialExpression: RegExp
  numberExpression: RegExp
  uuid: boolean
  numbers: number
  upper: number
  minLen: number
  maxLen: number
  special: number
  validMessage: string
  invalidMessage: string
  specific: boolean

  constructor({
    uuid = false,
    numbers = 1,
    upper = 1,
    minLen = 12,
    maxLen = 64,
    special = 1,
    validMessage = 'Your password is stroganoff',
    invalidMessage = 'Beef stew',
    specific = true,
  }: StroganoffOptions) {
    this.uuid = uuid
    this.numbers = numbers
    this.upper = upper
    this.minLen = minLen
    this.maxLen = maxLen
    this.special = special
    this.validMessage = validMessage
    this.invalidMessage = invalidMessage
    this.specific = specific

    if (this.numbers <= 0) {
      throw new Error('A good password needs numbers. Set numbers to above above 0.')
    }

    if (this.upper <= 0) {
      throw new Error('A good password needs uppercase characters. Set upper to anything above 0.')
    }

    if (this.minLen <= 3) {
      throw new Error(
        'A good password needs to be longer than 3 characters. Set minLen to anything above 3.'
      )
    }

    if (this.minLen > this.maxLen) {
      throw new Error('Your minimum length can not be longer than your maximum length')
    }

    if (this.special <= 0) {
      throw new Error('A good password needs special characters. Set special to anything above 1.')
    }

    // Required uppercase count
    const reqUppers = Array(this.upper).fill('.*[A-Z]').join('')

    // Required numbers count
    const reqNumbers = Array(this.numbers).fill('.*[0-9]').join('')

    // Required special characters count
    const reqSpecial = Array(this.special).fill('.*[!@#$%()&*-^=+;<>?]').join('')

    const exp = `^(?=${reqUppers})(?=${reqSpecial})(?=${reqNumbers}).{${minLen},${maxLen}}$`

    this.expression = new RegExp(exp)

    this.upperExpression = new RegExp(`^(?=${reqUppers})`)

    this.specialExpression = new RegExp(`^(?=${reqSpecial})`)

    this.numberExpression = new RegExp(`^(?=${reqNumbers})`)
  }

  private validateUUID(str: string) {
    // Do some tests before the regex so not just anything gets passed into regex
    if (str.length !== 36 || str.split('-').length !== 5) {
      return false
    }

    // Final test with regex
    return uuidRegex.test(str)
  }

  validate(input: string): StroganoffResult {
    if (this.uuid && this.validateUUID(input.toLocaleLowerCase())) {
      return {
        valid: true,
        message: this.validMessage,
        specific: {
          uuid: true,
        },
      }
    }

    const isValid = this.expression.test(input)

    // Password is valid & return specifics
    if (isValid && this.specific) {
      return {
        valid: true,
        message: this.validMessage,
        specific: {
          numbers: true,
          upper: true,
          special: true,
          minLen: true,
          maxLen: true,
        },
      }
    }

    // Password is valid but don't return any specifics
    if (isValid) {
      return {
        valid: true,
        message: this.validMessage,
      }
    }

    // Password is
    if (!this.specific) return { valid: false, message: this.invalidMessage }

    return {
      valid: false,
      message: this.invalidMessage,
      specific: {
        numbers: this.numberExpression.test(input),
        upper: this.upperExpression.test(input),
        special: this.specialExpression.test(input),
        minLen: input.length > this.minLen,
        maxLen: input.length < this.maxLen,
      },
    }
  }
}
