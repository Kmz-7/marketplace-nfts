import { expect, test } from '@playwright/test'

async function addGuestNft(page: import('@playwright/test').Page) {
  if ((page.viewportSize()?.width ?? 1440) < 768) {
    // No mobile o Figma oferece a compra na barra fixa do detalhe, não as ações de hover do card desktop.
    await page.goto('/nft?item=emerald-ape-042')
    await page.getByRole('button', { name: 'Comprar NFT' }).click()
  } else {
    await page.goto('/')
    await page.getByRole('button', { name: 'Adicionar Emerald Ape #042 ao carrinho' }).first().click()
    await expect(page.getByRole('status')).toContainText('Item adicionado ao seu carrinho')
    await page.getByRole('button', { name: 'Ir para o carrinho' }).click()
  }
}

async function authenticateCheckout(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Conectar e finalizar' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByLabel('E-mail').fill('ada@example.test')
  await dialog.locator('input[type="password"]').fill('KurioDemo123!')
  await dialog.getByRole('button', { name: 'Entrar', exact: true }).last().click()
  await expect(page).toHaveURL(/\/payment/)
}

test('abre um NFT, carrega avaliações e expande um comentário longo', async ({ page }) => {
  await page.goto('/nft?item=emerald-ape-042')

  await expect(page.locator('main h1').first()).toHaveText('Emerald Ape #042')
  await page.getByRole('tab', { name: 'Avaliações' }).click()

  const reviews = page.getByRole('region', { name: 'Avaliações de colecionadores' })
  await expect(reviews).toBeVisible()
  await expect(reviews.getByText(/avaliações/).first()).toBeVisible()
  await reviews.getByRole('button', { name: 'Ler mais' }).first().click()
  await expect(reviews.getByRole('button', { name: 'Ler menos' }).first()).toHaveAttribute(
    'aria-expanded',
    'true',
  )
})

test('mostra uma resposta clara quando o NFT solicitado não existe', async ({ page }) => {
  await page.goto('/nft?item=nft-inexistente')

  await expect(page.getByRole('heading', { name: 'NFT não encontrado' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Voltar ao catálogo' })).toBeVisible()
})

test('recebe atualização de preço pelo Socket.IO simulado', async ({ page }) => {
  const detailLoaded = page.waitForResponse((response) => {
    const url = new URL(response.url())
    return response.request().method() === 'GET' && url.pathname === '/api/nfts/emerald-ape-042' && response.ok()
  })
  await page.goto('/nft?item=emerald-ape-042')
  await detailLoaded
  await expect(page.getByText('1.19 ETH').filter({ visible: true }).first()).toBeVisible()

  const requestSucceeded = await page.evaluate(async () => {
    const response = await fetch('/api/mock/nfts/emerald-ape-042/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceEth: '1.35' }),
    })
    return response.ok
  })
  expect(requestSucceeded).toBe(true)
  await expect(page.getByText('1.35 ETH').filter({ visible: true }).first()).toBeVisible()
})

test('atualiza o item e a cotação do carrinho por Socket.IO', async ({ page }) => {
  await addGuestNft(page)
  await expect(page).toHaveURL(/\/cart/)
  await expect(page.getByText('1.19 ETH').filter({ visible: true }).first()).toBeVisible()

  const requestSucceeded = await page.evaluate(async () => {
    const response = await fetch('/api/mock/nfts/emerald-ape-042/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceEth: '1.35' }),
    })
    return response.ok
  })
  expect(requestSucceeded).toBe(true)
  await expect(page.getByText('1.35 ETH').filter({ visible: true }).first()).toBeVisible()
  await expect(page.getByText('1.366 ETH').filter({ visible: true }).first()).toBeVisible()
})

test('visitante adiciona item ao carrinho, ajusta quantidade e valida cupom', async ({ page }) => {
  await addGuestNft(page)
  await expect(page).toHaveURL(/\/cart/)
  await expect(page.locator('main h2:visible').filter({ hasText: 'Emerald Ape #042' })).toBeVisible()

  const increaseQuantity = page.getByRole('button', {
    name: 'Aumentar quantidade de Emerald Ape #042',
  })
  await increaseQuantity.click()
  await expect(increaseQuantity.locator('..').getByText('2', { exact: true })).toBeVisible()

  const coupon = page.getByRole('textbox', { name: 'Código promocional' }).filter({ visible: true })
  // O mobile usa o texto completo do Figma ("Digite o código promocional..."); o desktop, a forma curta.
  await expect(coupon).toHaveAttribute('placeholder', /^Digite o código/)
  await coupon.fill('CUPOM-INVALIDO')
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await expect(page.getByRole('alert')).toContainText('O código promocional não é válido.')
})

test('visitante autentica sem sair do fluxo e conclui a compra', async ({ page }) => {
  await addGuestNft(page)
  await authenticateCheckout(page)
  if ((page.viewportSize()?.width ?? 1440) >= 768) {
    await expect(page.getByLabel('Nome de exibição')).toHaveValue('Ada Collectora')
  }
  await page.evaluate(async () => {
    await fetch('/api/mock/commerce-scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario: 'timeout-after-create' }),
    })
  })
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(page).toHaveURL(/\/confirmation\?orderId=/)
  await expect(page.getByRole('heading', { name: 'Compra confirmada' })).toBeVisible()
})

test('pedido recusado mantém os itens no carrinho para nova tentativa', async ({ page }) => {
  await addGuestNft(page)
  await authenticateCheckout(page)
  await page.evaluate(async () => {
    await fetch('/api/mock/commerce-scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario: 'payment-declined' }),
    })
  })
  await page.getByRole('button', { name: 'Confirmar compra' }).click()

  await expect(page).toHaveURL(/\/confirmation\?orderId=/)
  await expect(page.getByRole('heading', { name: 'Não foi possível confirmar a compra' })).toBeVisible()
  await page.getByRole('button', { name: 'Voltar ao carrinho' }).click()
  await expect(page).toHaveURL(/\/cart/)
  await expect(page.locator('main h2:visible').filter({ hasText: 'Emerald Ape #042' })).toBeVisible()
})

test('favoritar solicita autenticação mantendo a página de detalhe', async ({ page }) => {
  await page.goto('/nft?item=emerald-ape-042')
  await page.getByRole('button', { name: /Favoritar( NFT)?$/ }).first().click()

  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page).toHaveURL(/\/nft\?item=emerald-ape-042/)
})

test('preenche e persiste os dados do perfil da conta autenticada', async ({ page }) => {
  await page.goto('/profile')
  await expect(page).toHaveURL(/\/login/)
  await page.getByRole('textbox', { name: 'E-mail', exact: true }).fill('ada@example.test')
  await page.locator('input[type="password"]').last().fill('KurioDemo123!')
  await page.getByRole('button', { name: 'Entrar', exact: true }).last().click()
  await expect(page).toHaveURL(/\/profile/)

  const displayName = page.getByLabel('Nome de exibição')
  await expect(displayName).toHaveValue('Ada Collectora')
  await expect(page.getByLabel('Nome de usuário')).toHaveValue('ada-collectora')
  const profileEmail = page.getByRole('textbox', { name: 'E-mail', exact: true })
  await expect(profileEmail).toHaveValue('ada@example.test')
  await expect(page.getByLabel('Nome ENS')).toHaveValue('ada.kurio.eth')
  await expect(page.getByLabel('Apelido da carteira')).toHaveValue('Carteira principal')

  await displayName.fill('Ada Colecionadora')
  const saveResponse = page.waitForResponse(
    (response) => response.url().endsWith('/api/profile') && response.request().method() === 'PUT',
  )
  await page.getByRole('button', { name: 'Salvar alterações' }).click()
  expect((await saveResponse).ok()).toBe(true)
  await page.reload()
  await expect(page.getByLabel('Nome de exibição')).toHaveValue('Ada Colecionadora')
})

test('mantém Home, detalhe, carrinho e pagamento sem overflow em 768 px', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 })
  const expectNoHorizontalOverflow = async () => {
    const fits = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    )
    expect(fits).toBe(true)
  }

  await page.goto('/')
  await expect(page.getByRole('main')).toBeVisible()
  await expectNoHorizontalOverflow()

  await page.goto('/nft?item=emerald-ape-042')
  await expect(page.locator('main h1').first()).toHaveText('Emerald Ape #042')
  await expectNoHorizontalOverflow()

  await addGuestNft(page)
  await expect(page).toHaveURL(/\/cart/)
  await expectNoHorizontalOverflow()

  await authenticateCheckout(page)
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeVisible()
  await expectNoHorizontalOverflow()
})

test('abre o diálogo de filtros mobile carregado sob demanda', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1440) >= 768)
  await page.goto('/')
  await page.getByRole('button', { name: 'Filtros', exact: true }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Filtros' })).toBeVisible()
  await dialog.getByRole('button', { name: 'Fechar filtros' }).click()
  await expect(dialog).toBeHidden()
})

test('abre a prévia ampliada da arte somente ao solicitar no desktop', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1440) < 768)
  await page.goto('/')
  const previewButton = page.getByRole('button', {
    name: 'Visualizar arte de Emerald Ape #042',
  })
  await previewButton.hover()
  await previewButton.click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
  await dialog.getByRole('button', { name: 'Fechar' }).click()
  await expect(dialog).toBeHidden()
})
