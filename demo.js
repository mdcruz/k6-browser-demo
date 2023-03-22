import { chromium } from 'k6/experimental/browser'
import { check } from 'k6'

export default async function() {
  const browser = chromium.launch({ headless: false })
  const page = browser.newPage();

  await page.goto('https://automationintesting.online/')

  page.locator('[data-testid="ContactName"]').type('Marie')
  page.locator('[data-testid="ContactEmail"]').type('test@123.com')
  page.locator('[data-testid="ContactPhone"]').type('01234567890')
  page.locator('[data-testid="ContactSubject"]').type('This is a demo subject')
  page.locator('[data-testid="ContactDescription"]').type('This is a demo description')
  page.locator('#submitContact').click()

  check(page, {
    'verification message': page => page.locator('.row.contact h2').innerText() === 'Thanks for getting in touch Marie!'
  })

  page.close()
  browser.close()
}