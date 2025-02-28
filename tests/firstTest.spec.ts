import {expect, test} from '@playwright/test'

test.beforeEach( async ({page}) => {
  await page.goto('http://localhost:4200/')
  await page.getByText('Forms').click()
})

test('First test', async ({page}) => {
  await page.getByText('Form Layouts').click()
})

test('Second test', async ({page}) => {
  await page.getByText('Datpicker').click()
})

test('Locator syntax rule', async ({page}) => {
  await page.locator('input').click() // tag name
  page.locator('#inputEmail') // id
  page.locator('.shape-rectangle') // class
  page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]') // full class
  page.locator('[placeholder="Email"]') // attribute
  page.locator('input[placeholder="Email"][nbinput]') // combine selectors
  page.locator('//*[@id="inputEmail1"]') // xpath
  page.locator(':text-is("Using the Grid")') // text
  page.locator(':text("Using")') // parcial text
})

test('Using facing locators', async ({page}) => {
  await page.getByRole('textbox', {name: "Email"}).first().click()
  await page.getByRole('button', {name: "Sign in"}).first().click()

  await page.getByLabel('Email').first().click()

  await page.getByPlaceholder('Jane Doe').click()

  // await page.getByTestId('SignIn').click() // this could be a attr created to automated like data-test

  await page.getByTitle('IoT Dashboard').click()
})

test('Locating child elements', async ({page}) => {
  await page.locator('nb-card nb-radio :text-is("option 1")').click()
  await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()
  await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()
  await page.locator('nb-card').nth(3).getByRole('button').click() // try to avoid
})

test('Locating parents elements', async ({page}) => {
  await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
  await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()
  
  await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
  await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Email"}).click()
  
  await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()

  await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})

test('Resusing locators', async ({page}) => {
  const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
  const emailField = basicForm.getByRole('textbox', {name: "Email"})

  await emailField.fill('teste@test.com')
  await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
  await basicForm.locator('nb-checkbox').click()
  await basicForm.getByRole('button').click()

  await expect(emailField).toHaveValue('teste@test.com')
})

test('Extracting values', async ({page}) => {
  // single text value
  const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
  const buttonSubmit = await basicForm.locator('button').textContent()
  expect(buttonSubmit).toEqual('Submit')

  // all values
  const allRadiosButtonsLabels = await page.locator('nb-radio').allTextContents()
  expect(allRadiosButtonsLabels).toContain('Option 1')

  // input value
  const emailField = basicForm.getByRole('textbox', {name: "Email"})
  await emailField.fill('teste@test.com')
  const emailValue = await emailField.inputValue()
  expect(emailValue).toEqual('teste@test.com')

  // attribute
  const placeholderValue = await emailField.getAttribute('placeholder')
  expect(placeholderValue).toEqual('Email')

})


