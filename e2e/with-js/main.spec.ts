import { test, expect } from '@playwright/test'
import { click, expectCookie, expectInputValue, expectVisible, goto } from '../utils'

const { describe, beforeEach } = test

describe('Index page', function () {
  beforeEach(async function ({ page }) {
    expectCookie(page)
  })

  test('Usuario puede entrar a un cuarto y ver su camara.', async function ({ page }) {
    const find = page.locator.bind(page)

    await goto(page, '/video')

    await find('input[name="user"]').fill('john')
    await find('input[name="user"]').press('Tab')

    await find('input[name="room"]').fill('midu')
    await find('input[name="room"]').press('Tab')

    await find('text=JOIN').press('Enter')
    await expectVisible(find, 'Room: midu')
    await expectVisible(find, 'Online: 1')
    await expectVisible(find, 'nickname: john')

    await click(page, 'text=Log out')
    const userInput = { name: 'user', value: 'john' }
    await expectInputValue(find, userInput)
    const roomInput = { name: 'room', value: 'midu' }
    await expectInputValue(find, roomInput)
  })
})
