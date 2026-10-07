import { describe, expect, it } from 'vitest'

import { initials, isValidEmail, isValidSlug, slugify } from './validation'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Acme Property Group')).toBe('acme-property-group')
  })

  it('collapses non-alphanumeric runs into a single hyphen', () => {
    expect(slugify('Acme & Co.  Property---Group!')).toBe('acme-co-property-group')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  -Acme Group-  ')).toBe('acme-group')
  })

  it('returns an empty string for input with no alphanumeric characters', () => {
    expect(slugify('***')).toBe('')
  })
})

describe('isValidSlug', () => {
  it('accepts lowercase letters, digits and hyphens', () => {
    expect(isValidSlug('acme-property-group-2')).toBe(true)
  })

  it('rejects uppercase letters', () => {
    expect(isValidSlug('Acme-Group')).toBe(false)
  })

  it('rejects spaces and other punctuation', () => {
    expect(isValidSlug('acme group')).toBe(false)
    expect(isValidSlug('acme_group')).toBe(false)
  })

  it('rejects leading, trailing, or doubled hyphens', () => {
    expect(isValidSlug('-acme')).toBe(false)
    expect(isValidSlug('acme-')).toBe(false)
    expect(isValidSlug('acme--group')).toBe(false)
  })

  it('rejects an empty string', () => {
    expect(isValidSlug('')).toBe(false)
  })
})

describe('isValidEmail', () => {
  it('accepts a well-formed email', () => {
    expect(isValidEmail('jane.doe@example.com')).toBe(true)
  })

  it('rejects a value with no @', () => {
    expect(isValidEmail('jane.doe-example.com')).toBe(false)
  })

  it('rejects a value with no domain extension', () => {
    expect(isValidEmail('jane.doe@example')).toBe(false)
  })

  it('rejects a value containing whitespace', () => {
    expect(isValidEmail('jane doe@example.com')).toBe(false)
  })
})

describe('initials', () => {
  it('uses the first letter of the first two words in a full name', () => {
    expect(initials('Jane Doe', undefined)).toBe('JD')
  })

  it('falls back to the email when no name is given', () => {
    expect(initials(undefined, 'jane.doe@example.com')).toBe('JA')
  })

  it('takes the first two characters of a single-word name', () => {
    expect(initials('Cher', undefined)).toBe('CH')
  })

  it('returns a question mark when neither name nor email is provided', () => {
    expect(initials(undefined, undefined)).toBe('?')
    expect(initials('   ', '')).toBe('?')
  })

  it('prefers name over email when both are given', () => {
    expect(initials('Jane Doe', 'someone-else@example.com')).toBe('JD')
  })
})
