const { validate, ErrorBag, Email, All, Type } = require('../dist')

describe('ErrorBag', () => {
  test('has instance', async () => {
    const errorBag = await validate({}, {})

    expect(errorBag).toBeInstanceOf(ErrorBag)
  })

  test('has errors', async () => {
    const errorBag = await validate({
      email: Email(),
    }, {})

    expect(errorBag.any()).toBe(true);
  })

  test('get error', async () => {
    const errorBag = await validate({
      email: Email(),
    }, {})

    expect(errorBag.get('email')).toBe('Email');
  })

  test('get nested error', async () => {
    const errorBag = await validate({
      customer: {
        contact: {
          email: Email()
        }
      },
    }, {
      customer: {
        contact: {
          email: ''
        }
      }
    })

    expect(errorBag.get('customer.contact.email')).toBe('Email');
  })

  test('get regex key error', async () => {
    const errorBag = await validate({
      customer: {
        contact: {
          email: Email()
        }
      },
    }, {
      customer: {
        contact: {
          email: ''
        }
      }
    })

    expect(errorBag.getRegex(/.+email/)).toBe('Email');
  })
})