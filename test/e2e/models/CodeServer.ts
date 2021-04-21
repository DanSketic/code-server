import { Page } from "playwright"
import { CODE_SERVER_ADDRESS } from "../../utils/constants"
// This is a Page Object Model
// We use these to simplify e2e test authoring
// See Playwright docs: https://playwright.dev/docs/pom/
export class CodeServer {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Navigates to CODE_SERVER_ADDRESS
   */
  async navigate() {
    await this.page.goto(CODE_SERVER_ADDRESS, { waitUntil: "networkidle" })
    // Make sure the editor actually loaded
    await this.page.isVisible("div.monaco-workbench")
  }

  /**
   * Focuses Integrated Terminal
   * by going to the Application Menu
   * and clicking View > Terminal
   */
  async focusTerminal() {
    // Open using the manu
    // Click [aria-label="Application Menu"] div[role="none"]
    await this.page.click('[aria-label="Application Menu"] div[role="none"]')

    // Click text=View
    await this.page.hover("text=View")
    await this.page.click("text=View")

    // Click text=Terminal
    await this.page.hover("text=Terminal")
    await this.page.click("text=Terminal")
  }
}
