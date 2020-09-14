import Stroganoff from '../src/stroganoff'

/**
 * Stroganoff
 */
describe('Stroganoff', () => {
  it('should return the validation expression', () => {
    const stroganoff = new Stroganoff({})
    expect(String(stroganoff.expression)).toBe('/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{12,64}$/')

    expect(new RegExp(stroganoff.expression)).toBeTruthy()
  })

  it('should create a new Stroganoff instance', () => {
    expect(new Stroganoff({})).toBeInstanceOf(Stroganoff)
  })

  describe('given default options', () => {
    const stroganoff = new Stroganoff({})
    it('should return false when a password is too short', () => {
      const result = stroganoff.validate('123')

      expect(result.valid).toBe(false)

      // @ts-ignore
      expect(result.specific.minLen).toBe(false)
    })

    it('should return false when a password has no numbers', () => {
      const result = stroganoff.validate('abc')

      expect(result.valid).toBe(false)

      // @ts-ignore
      expect(result.specific.numbers).toBe(false)
    })

    it('should return false when a password has no special characters', () => {
      const result = stroganoff.validate('abc')

      expect(result.valid).toBe(false)

      // @ts-ignore
      expect(result.specific.special).toBe(false)
    })

    it('should return false when a password is too long', () => {
      const input = Array(65).fill('aA1!').join('')
      const result = stroganoff.validate(input)

      expect(result.valid).toBe(false)

      // @ts-ignore
      expect(result.specific.maxLen).toBe(false)
    })

    it('should return true for a just good enough pasword', () => {
      const input = 'aB1@FcaB1@Fc'
      const result = stroganoff.validate(input)

      expect(result.valid).toBe(true)

      // @ts-ignore
      expect(result.specific.maxLen).toBe(true)
      // @ts-ignore
      expect(result.specific.minLen).toBe(true)
      // @ts-ignore
      expect(result.specific.special).toBe(true)
      // @ts-ignore
      expect(result.specific.numbers).toBe(true)
    })
  })

  describe('given override options', () => {
    it('should return false when a password is too short', () => {
      const stroganoff = new Stroganoff({ minLen: 10 })
      const input = '123ABC!@#'
      const result = stroganoff.validate(input)
      expect(input).toHaveLength(9)

      expect(result.valid).toBe(false)

      // @ts-ignore
      expect(result.specific.minLen).toBe(false)
    })

    it('should return false when a password does not have enough special chars', () => {
      const stroganoff = new Stroganoff({ special: 10 })
      const input = '123ABC!@#'
      const result = stroganoff.validate(input)

      expect(result.valid).toBe(false)

      // @ts-ignore
      expect(result.specific.special).toBe(false)
    })

    it('should return false when a password does not have enough numbers', () => {
      const stroganoff = new Stroganoff({ numbers: 4 })
      const input = '123ABC!@#'
      const result = stroganoff.validate(input)

      expect(result.valid).toBe(false)

      // @ts-ignore
      expect(result.specific.numbers).toBe(false)
    })

    it('should return false when a password is too long', () => {
      const stroganoff = new Stroganoff({ maxLen: 20 })
      const input = Array(21).fill('aA1!').join('')
      const result = stroganoff.validate(input)

      expect(result.valid).toBe(false)

      // @ts-ignore
      expect(result.specific.maxLen).toBe(false)
    })
  })

  describe('given the developer does not want specific details', () => {
    it('should return true for a valid password', () => {
      const stroganoff = new Stroganoff({ specific: false })
      const input = '123ABC!@#aB1@Fc'
      const result = stroganoff.validate(input)

      expect(result.valid).toBe(true)

      // @ts-ignore
      expect(result.specific).toBeUndefined()
    })

    it('should return false for an invalid password', () => {
      const stroganoff = new Stroganoff({ specific: false })
      const input = 'abc'
      const result = stroganoff.validate(input)

      expect(result.valid).toBe(false)

      // @ts-ignore
      expect(result.specific).toBeUndefined()
    })
  })

  describe('given the developer inputs bad options', () => {
    it('should throw if number is less than 1', async () => {
      expect(() => new Stroganoff({ numbers: 0 })).toThrowErrorMatchingInlineSnapshot(
        `"A good password needs numbers. Set numbers to above above 0."`
      )
    })

    it('should throw if upper is less than 1', async () => {
      expect(() => new Stroganoff({ upper: 0 })).toThrowErrorMatchingInlineSnapshot(
        `"A good password needs uppercase characters. Set upper to anything above 0."`
      )
    })

    it('should throw if special is less than 1', async () => {
      expect(() => new Stroganoff({ special: 0 })).toThrowErrorMatchingInlineSnapshot(
        `"A good password needs special characters. Set special to anything above 1."`
      )
    })

    it('should throw if minLen is less than 3', async () => {
      expect(() => new Stroganoff({ minLen: 2 })).toThrowErrorMatchingInlineSnapshot(
        `"A good password needs to be longer than 3 characters. Set minLen to anything above 3."`
      )
    })

    it('should throw if min length is greater than max length', async () => {
      expect(() => new Stroganoff({ minLen: 20, maxLen: 10 })).toThrowErrorMatchingInlineSnapshot(
        `"Your minimum length can not be longer than your maximum length"`
      )
    })
  })

  describe('given the input has multiple special characters', () => {
    const stroganoff = new Stroganoff({})

    it('should still validate as true', () => {
      expect(stroganoff.validate('123ABCabc!@#').valid).toBeTruthy()
    })
  })
})
