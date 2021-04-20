import { test, expect } from "@playwright/test"
import * as fs from "fs"
import { tmpdir } from "os"
import * as path from "path"

import { STORAGE } from "../utils/constants"
import { CodeServer } from "./models/CodeServer"

test.describe("Integrated Terminal", () => {
  // Create a new context with the saved storage state
  // so we don't have to logged in
  const options: any = {}
  const testFileName = "test.txt"
  const testString = "new string test from e2e test"
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

  test("should echo a string to a file", options, async ({ page }) => {
    // TODO@jsjoeio
    // import tempdir from
    // src/node/util.ts
    // TODO use this
    // ${tmpdir}/tests/${testName}/
    const tmpFolderPath = fs.mkdtempSync(path.join(tmpdir(), "code-server-test"))
    const tmpFile = `${tmpFolderPath}${path.sep}${testFileName}`
    // Open terminal and type in value
    // await codeServer.viewTerminal()
    await codeServer.focusTerminal()

    await page.keyboard.type(`echo '${testString}' > ${tmpFile}`)
    // Wait for the typing to finish before hitting enter
    await page.waitForTimeout(500)
    await page.keyboard.press("Enter")
    await page.waitForTimeout(2000)

    let fileExists = false

    try {
      // Check that the file exists
      await fs.promises.access(tmpFile, fs.constants.F_OK)
      fileExists = true
    } catch (error) {
      console.error("Could not find file")
    }

    expect(fileExists).toBe(true)

    // TODO delete tmpFolder
  })
})
