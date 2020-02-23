import Stroganoff, { StroganoffOptions } from '../src/stroganoff'

/**
 * Stroganoff
 */
describe('Stroganoff', () => {
  it('should be valid with min length override', async () => {
    const minLen = 5
    const stroganoff = new Stroganoff({ minLen })

    const input = 'A!3a#'

    expect(input).toHaveLength(minLen)

    expect(stroganoff.validate('A!3a#').valid).toBe(true)
  })

  it('should validate bad passwords with default options', async () => {
    const stroganoff = new Stroganoff({})

    // Too short
    expect(stroganoff.validate('123').valid).toBe(false)

    // No caps
    expect(stroganoff.validate('abc12345!').valid).toBe(false)

    // No special characters
    expect(stroganoff.validate('abc12345A').valid).toBe(false)

    // No numbers
    expect(stroganoff.validate('abcAAA!@#').valid).toBe(false)
  })

  it('should validate good passwords with default options', async () => {
    const stroganoff = new Stroganoff({})

    expect(stroganoff.validate('123wwsssA!').valid).toBe(true)
  })
})
