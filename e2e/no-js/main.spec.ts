import { test, expect } from '@playwright/test'
import {
  click,
  expectInputValue,
  expectVisible,
  goto,
  expectPath
} from '../utils'

test.use({ javaScriptEnabled: false })

const { describe, beforeEach } = test

describe('No js', function () {
  // beforeEach(async function ({ page }) { })

  test('Usuario entra al room chat.', async function ({ page }) {
    const find = page.locator.bind(page)

    await goto(page, '/video')

    await find('input[name="user"]').fill('john')
    await find('input[name="user"]').press('Tab')

    await find('input[name="room"]').fill('midu')
    await find('input[name="room"]').press('Tab')

    await find('text=JOIN').press('Enter')

    await expectPath(page, 'chat')
  })
})
