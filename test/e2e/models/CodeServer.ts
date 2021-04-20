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
    // TODO@jsjoeio
    // you're not using absolutePath. either remove or use
  }

  /**
   * Creates a temproary folder in the User folder
   * with the name "e2e_test_temp_folder"
   * unless tempFolderName is passed in
   */
  async createTempFolder(tempFolderName = "e2e_test_temp_folder") {
    // Open User folder
    await this.openFolder()

    // Click the Explorer file area
    // Otherwise, when we create a folder, it could create it
    // in another folder based on where the cursor last was
    await this.page.click(".explorer-folders-view")
    // Create new folder
    await this.page.keyboard.press("Meta+Shift+P")
    await this.page.keyboard.type("File: New Folder")
    // Let the typing finish
    await this.page.waitForTimeout(1000)
    await this.page.keyboard.press("Enter")
    await this.page.keyboard.type(tempFolderName)
    // Let the typing finish
    await this.page.waitForTimeout(1000)
    await this.page.keyboard.press("Enter")
  }

  async deleteTempFolder(tempFolderName = "e2e_test_temp_folder") {
    // how to delete?
    // Check if folder is visible
    const tempFolderSelector = `text=${tempFolderName}`
    const folderExists = await this.page.isVisible(tempFolderSelector)

    if (folderExists) {
      await this.page.click(tempFolderSelector, { button: "right" })
      // Click text=Delete Permanently
      await this.page.click("text=Delete Permanently")

      // Click text=Delete
      await this.page.click("text=Delete")
      // Give it a second to disappear
      await this.page.waitForTimeout(1000)
    }
  }

  /**
   * Toggles the integrated terminal if not already in view
   * and focuses it
   */
  async viewTerminal() {
    // Check if Terminal is already in view
    const isTerminalInView = await this.page.isVisible("#terminal")

    if (!isTerminalInView) {
      // Open using default keyboard shortcut
      await this.focusTerminal()
      await this.page.waitForSelector("#terminal")
    }
  }

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

  async quickOpen(input: string) {
    await this.page.keyboard.press("Meta+P")
    await this.page.waitForSelector('[aria-describedby="quickInput_message"]')
    await this.page.keyboard.type(input)
    await this.page.waitForTimeout(2000)
    await this.page.keyboard.press("Enter")
    await this.page.waitForTimeout(2000)
  }
}
