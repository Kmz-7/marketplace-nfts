import { expect, test, type Page } from '@playwright/test'

const demoEmail = 'ada@example.test'
const demoPassword = 'KurioDemo123!'

async function setReferenceViewport(page: Page) {
  const mobile = (page.viewportSize()?.width ?? 1440) < 768
  await page.setViewportSize({ width: mobile ? 390 : 1440, height: 900 })
}

async function prepareGuestCart(page: Page) {
  if ((page.viewportSize()?.width ?? 1440) < 768) {
    await page.goto('/nft?item=emerald-ape-042')
    await page.getByRole('button', { name: 'Comprar NFT' }).click()
    await expect(page).toHaveURL(/\/cart/)
    return
  }

  await page.goto('/')
  await page.getByRole('button', { name: 'Adicionar Emerald Ape #042 ao carrinho' }).first().click()
  await page.getByRole('button', { name: 'Ir para o carrinho' }).click()
  await expect(page).toHaveURL(/\/cart/)
}

async function signInForPayment(page: Page) {
  await page.getByRole('button', { name: 'Conectar e finalizar' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByLabel('E-mail').fill(demoEmail)
  await dialog.locator('input[type="password"]').fill(demoPassword)
  await dialog.getByRole('button', { name: 'Entrar', exact: true }).last().click()
  await expect(page).toHaveURL(/\/payment/)
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeVisible()
}

async function waitForStableFullPage(page: Page, filename: string) {
  // Scroll visits deferred sections and lazy images before taking the versioned baseline.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  if ((page.viewportSize()?.width ?? 1440) >= 768) {
    await expect(page.getByRole('contentinfo')).toBeVisible()
  }
  if (filename === 'nft-detail.png') {
    await expect(page.getByRole('region', { name: 'Mais destaques' })).toBeVisible()
  }
  if (filename === 'cart.png' && (page.viewportSize()?.width ?? 1440) >= 768) {
    await expect(page.getByRole('region', { name: 'Colecionadores também viram' })).toBeVisible()
  }
  await page.evaluate(async () => {
    await document.fonts.ready
    const images = Array.from(document.images)
    images.forEach((image) => { image.loading = 'eager' })
    await Promise.all(images.map((image) => image.decode().catch(() => undefined)))
  })
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(page).toHaveScreenshot(filename, {
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio: 0.01,
  })
}

test('regressão visual da Home em desktop e mobile', async ({ page }) => {
  await setReferenceViewport(page)
  await page.goto('/')
  await expect(page.getByRole('main')).toBeVisible()
  await waitForStableFullPage(page, 'home.png')
})

test('regressão visual do detalhe do NFT em desktop e mobile', async ({ page }) => {
  await setReferenceViewport(page)
  await page.goto('/nft?item=emerald-ape-042')
  await expect(page.locator('main h1').first()).toHaveText('Emerald Ape #042')
  await waitForStableFullPage(page, 'nft-detail.png')
})

test('regressão visual do carrinho em desktop e mobile', async ({ page }) => {
  await setReferenceViewport(page)
  await prepareGuestCart(page)
  await expect(page.locator('main h2:visible').filter({ hasText: 'Emerald Ape #042' })).toBeVisible()
  await waitForStableFullPage(page, 'cart.png')
})

test('regressão visual do pagamento em desktop e mobile', async ({ page }) => {
  await setReferenceViewport(page)
  await prepareGuestCart(page)
  await signInForPayment(page)
  await waitForStableFullPage(page, 'payment.png')
})
