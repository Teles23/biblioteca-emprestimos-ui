import { test, expect, type Page } from '@playwright/test';

const admin = {
  email: 'admin@biblioteca.local',
  password: 'Admin@123',
};

const unique = () => `${Date.now()}`;

async function login(page: Page) {
  await page.goto('/login');
  await fieldByLabel(page, 'E-mail').fill(admin.email);
  await fieldByLabel(page, 'Senha').fill(admin.password);
  await page.getByRole('button', { name: /entrar no sistema/i }).click();
  await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
}

function fieldByLabel(page: Page, label: string) {
  return page.locator(`label:has-text("${label}")`).locator('..').locator('input, textarea, select');
}

async function selectFirstNonEmptyOption(select: Page['locator']) {
  const options = await select.locator('option').allTextContents();
  const label = options.find((opt) => opt.trim() && !opt.toLowerCase().includes('selecione'));
  if (!label) {
    throw new Error('No selectable option found');
  }
  await select.selectOption({ label });
  return label.trim();
}

test.describe.serial('Core flows', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Authors CRUD', async ({ page }) => {
    const authorName = `Autor QA ${unique()}`;

    await page.goto('/autores');
    await page.getByRole('link', { name: /novo autor/i }).click();

    await fieldByLabel(page, 'Nome Completo').fill(authorName);
    await fieldByLabel(page, 'Ano de Nascimento').fill('1980');
    await fieldByLabel(page, 'Ano de Falecimento').fill('2010');
    await fieldByLabel(page, 'Nacionalidade').fill('Brasileiro');
    await fieldByLabel(page, 'Biografia').fill('Autor criado para teste E2E.');
    await page.getByRole('button', { name: /salvar autor/i }).click();

    await expect(page.getByRole('heading', { name: /autores/i })).toBeVisible();
    await page.getByPlaceholder(/buscar por nome/i).fill(authorName);
    await expect(page.getByRole('cell', { name: authorName })).toBeVisible();

    const row = page.locator('tbody tr').filter({ hasText: authorName });
    await row.getByTitle('Editar').click();
    await fieldByLabel(page, 'Biografia').fill('Autor atualizado no teste.');
    await page.getByRole('button', { name: /salvar autor/i }).click();

    await page.getByPlaceholder(/buscar por nome/i).fill(authorName);
    await expect(page.locator('tbody')).toContainText(authorName);

    await row.getByTitle('Excluir').click();
    await page.getByRole('button', { name: /excluir autor/i }).click();
    await expect(page.locator('tbody')).not.toContainText(authorName);
  });

  test('Categories CRUD', async ({ page }) => {
    const categoryName = `Categoria QA ${unique()}`;
    const categoryNameUpdated = `${categoryName} Editada`;

    await page.goto('/categorias');
    await fieldByLabel(page, 'Nome da Categoria').fill(categoryName);
    await page.getByRole('button', { name: /\+ criar/i }).click();

    await page.getByPlaceholder(/buscar por nome/i).fill(categoryName);
    await expect(page.locator('tbody')).toContainText(categoryName);

    const row = page.locator('tbody tr').filter({ hasText: categoryName });
    await row.getByRole('link').first().click();
    await fieldByLabel(page, 'Nome da Categoria').fill(categoryNameUpdated);
    await page.getByRole('button', { name: /salvar categoria/i }).click();

    await page.getByPlaceholder(/buscar por nome/i).fill(categoryNameUpdated);
    await expect(page.locator('tbody')).toContainText(categoryNameUpdated);

    const updatedRow = page.locator('tbody tr').filter({ hasText: categoryNameUpdated });
    await updatedRow.locator('button.btn-danger').click();
    await page.getByRole('button', { name: /excluir categoria/i }).click();
    await expect(page.locator('tbody')).not.toContainText(categoryNameUpdated);
  });

  test('Books CRUD + filters', async ({ page }) => {
    const bookTitle = `Livro QA ${unique()}`;
    const bookTitleUpdated = `${bookTitle} Editado`;

    await page.goto('/livros');
    await page.getByRole('link', { name: /adicionar livro/i }).click();

    await fieldByLabel(page, 'Título').fill(bookTitle);
    await fieldByLabel(page, 'Ano de Publicação').fill('2020');
    await fieldByLabel(page, 'Editora').fill('Editora QA');
    await fieldByLabel(page, 'Número de Páginas').fill('123');
    await fieldByLabel(page, 'Sinopse').fill('Livro criado para testes E2E.');

    const categorySelect = page.locator('select[name="categoryId"]');
    const selectedCategory = await selectFirstNonEmptyOption(categorySelect);

    const authorList = page.locator('.main-scrollbar');
    const orwell = authorList.getByText('George Orwell', { exact: false });
    if (await orwell.count()) {
      await orwell.first().click();
    } else {
      await authorList.locator('div').first().click();
    }

    await page.getByRole('button', { name: /salvar livro/i }).click();
    await expect(page.getByRole('heading', { name: /livros/i })).toBeVisible();

    await page.getByPlaceholder(/buscar por/i).fill(bookTitle);
    await expect(page.locator('tbody')).toContainText(bookTitle);

    const row = page.locator('tbody tr').filter({ hasText: bookTitle });
    await row.getByTitle('Editar').click();
    await fieldByLabel(page, 'Título').fill(bookTitleUpdated);
    await page.getByRole('button', { name: /salvar livro/i }).click();

    await page.getByPlaceholder(/buscar por/i).fill(bookTitleUpdated);
    await expect(page.locator('tbody')).toContainText(bookTitleUpdated);

    await page.locator('.filter-select-wide').selectOption({ label: selectedCategory });
    await page.locator('.filter-select').selectOption('AVAILABLE');
    await expect(page.locator('tbody')).toContainText(bookTitleUpdated);

    const updatedRow = page.locator('tbody tr').filter({ hasText: bookTitleUpdated });
    await updatedRow.getByTitle('Excluir').click();
    await page.getByRole('button', { name: /excluir livro/i }).click();
    await expect(page.locator('tbody')).not.toContainText(bookTitleUpdated);
  });

  test('Users CRUD (reader)', async ({ page }) => {
    const readerName = `Leitor QA ${unique()}`;
    const readerEmail = `leitor.qa.${unique()}@email.com`;

    await page.goto('/usuarios');
    await page.getByRole('link', { name: /cadastrar leitor/i }).click();

    await fieldByLabel(page, 'Nome completo').fill(readerName);
    await fieldByLabel(page, 'E-mail').fill(readerEmail);
    await fieldByLabel(page, 'Telefone').fill('(11) 99999-1234');
    await page.getByRole('button', { name: /cadastrar leitor/i }).click();

    await expect(page.getByText('SENHA GERADA')).toBeVisible();
    await expect(page.getByText('Será exibida após salvar')).not.toBeVisible();

    await page.getByRole('button', { name: /cancelar/i }).click();

    await page.getByPlaceholder(/buscar por nome ou e-mail/i).fill(readerEmail);
    await expect(page.locator('tbody')).toContainText(readerEmail);

    const row = page.locator('tbody tr').filter({ hasText: readerEmail });
    await row.getByTitle('Excluir').click();
    await page.getByRole('button', { name: /remover usuário/i }).click();
    await expect(page.locator('tbody')).not.toContainText(readerEmail);
  });

  test('Loans flow + history filter', async ({ page }) => {
    await page.goto('/emprestimos/novo');

    const bookSelect = page.locator('select[name="bookId"]');
    const userSelect = page.locator('select[name="userId"]');

    const selectedBook = await selectFirstNonEmptyOption(bookSelect);
    const selectedUser = await selectFirstNonEmptyOption(userSelect);

    await page.getByRole('button', { name: /confirmar empréstimo/i }).click();
    await expect(page.getByRole('heading', { name: /empréstimos/i })).toBeVisible();

    await expect(page.locator('tbody')).toContainText(selectedBook);
    const loanRow = page.locator('tbody tr').filter({ hasText: selectedBook });
    await loanRow.getByRole('button', { name: /devolver/i }).click();
    await page.getByRole('button', { name: /confirmar devolução/i }).click();

    await page.goto('/historico');
    await fieldByLabel(page, 'Status').selectOption('RETURNED');
    await page.getByRole('button', { name: /🔍/ }).click();
    await expect(page.locator('tbody')).toContainText(selectedBook);
    await expect(page.locator('tbody')).toContainText(selectedUser);
  });
});

test.describe('Responsive smoke', () => {
  const viewports = [
    { name: 'desktop', width: 1280, height: 800 },
    { name: 'tablet', width: 900, height: 700 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    test(`Layout renders on ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await login(page);
      await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();

      if (vp.name === 'mobile') {
        await page.getByLabel('Abrir menu').click();
        await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
      }
    });
  }
});
