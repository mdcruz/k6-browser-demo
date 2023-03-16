import { chromium } from 'k6/experimental/browser'
import { check } from 'k6'
import http from 'k6/http'

export const options = {
  scenarios: {
    browser: {
      executor: 'per-vu-iterations',
      exec: 'browserTest'
    },
    protocol: {
      executor: 'constant-vus',
      exec: 'protocolTest',
      vus: 20,
      duration: '30s',
    },
  }
}

export async function browserTest() {
  const browser = chromium.launch({ headless: false });
  const page = browser.newPage();

  await page.goto('https://otel-demo.field-eng.grafana.net/');

  const productCard = page.locator('(//div[@data-cy="product-card"])[1]');
  await productCard.click();

  const quantityOption = page.locator('[data-cy="product-quantity"]');
  quantityOption.selectOption('3');

  const addToCartBtn = page.locator('[data-cy="product-add-to-cart"]');
  await addToCartBtn.click();
  
  check(page, {
    'cart item name': page => page.locator('//p[text()="National Park Foundation Explorascope"]').isVisible() == true,
    'cart item quantity': page => page.locator('//p[text()="3"]').isVisible() == true,
  })

  page.close();
  browser.close();
}

export function protocolTest() {
  const res = http.get('https://otel-demo.field-eng.grafana.net/');

  check(res, {
    'status is 200': res => res.status === 200,
  });
}
