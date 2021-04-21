import { test, expect } from "@playwright/test"
import { STORAGE } from "../utils/constants"
import { CodeServer } from "./models/CodeServer"

test.describe("CodeServer", () => {
  // Create a new context with the saved storage state
  // so we don't have to logged in
  const options: any = {}
  let codeServer: CodeServer

  // TODO@jsjoeio
  // Fix this once https://github.com/microsoft/playwright-test/issues/240
  // is fixed
  if (STORAGE) {
    const storageState = JSON.parse(STORAGE) || {}
    options.contextOptions = {
      storageState,
    }
  }

  test.beforeEach(async ({ page }) => {
    codeServer = new CodeServer(page)
    await codeServer.navigate()
  })

  test("should show the Integrated Terminal", options, async ({ page }) => {
    await codeServer.focusTerminal()
    expect(await page.isVisible("#terminal")).toBe(true)
  })
})
