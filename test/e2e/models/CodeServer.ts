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
  async navigate() {
    await this.page.goto(CODE_SERVER_ADDRESS, { waitUntil: "networkidle" })
    // Make sure the editor actually loaded
    await this.page.isVisible("div.monaco-workbench")
  }
  /**
   * Opens the default folder /User if no arg passed
   * @param absolutePath Example: /Users/jp/.local/share/code-server/User/
   *
   */
  async openFolder(absolutePath?: string) {
    // Check if no folder is opened
    const folderIsNotOpen = await this.page.isVisible("text=You have not yet opened")

    if (folderIsNotOpen) {
      // Open the default folder
      await this.page.keyboard.press("Meta+O")
      await this.page.keyboard.press("Enter")
      await this.page.waitForLoadState("networkidle")
    }
  }
}
