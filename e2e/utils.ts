import { expect, Page } from '@playwright/test'
import fs from 'fs'

const BASE_URL = 'http://localhost:3000'

export async function sleep (ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

export async function click (page: Page, query: string) {
  await page.locator(query).click()
}

export async function press (page: Page, text: string) {
  await page.locator(`text="${text}"`).click()
}

export async function select (page: Page, text: string) {
  await page.locator(`text="${text}"`).click()
}

export async function selectFirst (page: Page, text: string) {
  await page.locator(`text="${text}"`).nth(0).click()
}

export async function selectSecond (page: Page, text: string) {
  await page.locator(`text="${text}"`).nth(1).click()
}

export async function expectPath (page: Page, path: string) {
  // if time is not enough it will receive /path?index
  // 'sleep' used due to remix actions cycle:
  // - from a <Form/> it will issue a post fetch request to /path?index
  // - then on happy path, meaning no errors on validations
  // remix redirect will send out headers with a new Location like:
  // headers: { Location: "/else/where" }
  await sleep(300)
  await expect(page.url()).toEqual(`${BASE_URL}/${path}`)
}

export async function goto (page: Page, url: string) {
  await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle' })
}

interface StepsOpt { label: string, content: string }

export async function expectTimeline (find: any, { steps }: { steps: StepsOpt[] }) {
  const [step1, step2, step3] = steps
  await expect(find('[aria-label="step-1"]')).toContainText(step1.label)
  await expect(find('[aria-label="step-1"]')).toHaveAttribute('data-content', step1.content)
  await expect(find('[aria-label="step-2"]')).toContainText(step2.label)
  await expect(find('[aria-label="step-2"]')).toHaveAttribute('data-content', step2.content)
  await expect(find('[aria-label="step-3"]')).toContainText(step3.label)
  await expect(find('[aria-label="step-3"]')).toHaveAttribute('data-content', step3.content)
}

export async function expectVisible (find: any, text: string) {
  await expect(find('text=\"' + text + '\"')).toBeVisible()
}

export async function expectInputValue (find: any, opts: {name: string, value: string}) {
  await expect(find(`input[name=${opts.name}]`)).toHaveValue(opts.value)
}

export async function expectCookie (page: Page) {
  // if you got a new session token
  // you should change the 'cookies.json' too
  // or you might get an error message like:
  // ApolloError: Foreign key violation. insert or update on table...
  const cookies = fs.readFileSync('./e2e/cookies.json', 'utf8')
  const deserializedCookies = JSON.parse(cookies)
  await page.context().addCookies(deserializedCookies)

  await expect(deserializedCookies[0].url).toEqual('http://localhost:8082')
}
