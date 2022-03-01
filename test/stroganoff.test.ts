import { v1 as uuidv1, v3 as uuidv3, v4 as uuidv4, v5 as uuidv5 } from 'uuid'
import Stroganoff from '../src/stroganoff'

/**
 * Stroganoff
 */
describe('Stroganoff', () => {
  it('should return the validation expression', () => {
    const stroganoff = new Stroganoff({})
    expect(String(stroganoff.expression)).toBe(
      '/^(?=.*[A-Z])(?=.*[!@#$%()&*-^=+;<>?])(?=.*[0-9]).{12,64}$/'
    )

    expect(new RegExp(stroganoff.expression)).toBeTruthy()
  })

  it('should create a new Stroganoff instance', () => {
    expect(new Stroganoff({})).toBeInstanceOf(Stroganoff)
  })

  describe('given Melvin enters some weird passwords', () => {
    it('should be true for pzbhef-1Gonvo-daftyb', () => {
      const stroganoff = new Stroganoff({})

      const result = stroganoff.validate('pzbhef-1Gonvo-daftyb')

      expect(result.valid).toBe(true)
    })
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

    it('should return true for a just good enough password', () => {
      const input = '123Abc!abcef'
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

    const characters = '!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~<>?~'.split('').map((char) => char)
    const basePassword = 'Abc1asdfgfe'

    test.each(characters)('Accept special character %s', (char) => {
      expect(true).toBe(true)

      expect(stroganoff.validate(`${basePassword}${char}`)).toBeTruthy()
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
      const weakPassword = '123ABC!@#'
      const stringPassword = '1234ABC!@#ab'

      expect(stroganoff.validate(weakPassword).valid).toBe(false)

      // @ts-ignore
      expect(stroganoff.validate(weakPassword).specific.numbers).toBe(false)

      expect(stroganoff.validate(stringPassword).valid).toBe(true)

      // @ts-ignore
      expect(stroganoff.validate(stringPassword).specific.numbers).toBe(true)
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

  describe('given the password is a uuid', () => {
    const stroganoff = new Stroganoff({ uuid: true })

    const v1Ids = [
      'c7ddcbd0-9913-11ec-b909-0242ac120002',
      '72631062-9912-11ec-b909-0242ac120002',
      '2f01f7d8-9913-11ec-b909-0242ac120002',
      'c00a462c-9913-11ec-b909-0242ac120002',
      'cee2752a-9913-11ec-b909-0242ac120002',
      'd5143460-9913-11ec-b909-0242ac120002',
      'da21730a-9913-11ec-b909-0242ac120002',
    ]

    it.each(v1Ids)('uuid v1(%s)', (a) => {
      expect(stroganoff.validate(a).valid).toBeTruthy()

      const invalid = a.substring(0, Math.floor(Math.random() * a.length))
      expect(stroganoff.validate(invalid).valid).toBeFalsy()
    })

    const v3Ids = Array(100)
      .fill(null)
      .map(() => {
        const namespace = uuidv1()
        const name = uuidv1()
        return uuidv3(name, namespace)
      })

    it.each(v3Ids)('uuid v3(%s)', (a) => {
      expect(stroganoff.validate(a).valid).toBeTruthy()
      const invalid = a.substring(0, Math.floor(Math.random() * a.length))
      expect(stroganoff.validate(invalid).valid).toBeFalsy()
    })

    const v4Ids = Array(100)
      .fill(null)
      .map(() => {
        return uuidv4()
      })

    it.each(v4Ids)('uuid v4(%s)', (a) => {
      expect(stroganoff.validate(a).valid).toBeTruthy()
      const invalid = a.substring(0, Math.floor(Math.random() * a.length))
      expect(stroganoff.validate(invalid).valid).toBeFalsy()
    })

    const v5Ids = Array(100)
      .fill(null)
      .map(() => {
        const namespace = uuidv1()
        const name = uuidv1()
        return uuidv5(name, namespace)
      })

    it.each(v5Ids)('uuid v5(%s)', (a) => {
      expect(stroganoff.validate(a).valid).toBeTruthy()
      const invalid = a.substring(0, Math.floor(Math.random() * a.length))
      expect(stroganoff.validate(invalid).valid).toBeFalsy()
    })
  })
})
