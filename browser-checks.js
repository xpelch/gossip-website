async (page) => {
  const base = "http://127.0.0.1:43848";
  const results = [];
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));

  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/connect.html"]) {
      await page.goto(base + path);
      await page.evaluate(() => document.fonts.ready);
      const metrics = await page.evaluate(() => ({
        width: innerWidth,
        content: document.documentElement.scrollWidth,
        h1: document.querySelectorAll("h1").length,
        brokenAnchors: [
          ...document.querySelectorAll('a[href^="#"], a[href*="#"]'),
        ]
          .filter((a) => {
            const url = new URL(a.href);
            return (
              url.origin === location.origin &&
              url.pathname === location.pathname &&
              url.hash &&
              !document.getElementById(url.hash.slice(1))
            );
          })
          .map((a) => a.href),
      }));
      if (
        metrics.content > width ||
        metrics.h1 !== 1 ||
        metrics.brokenAnchors.length
      )
        throw new Error(JSON.stringify(metrics));
      results.push({ width, path, ...metrics });
      await page.screenshot({
        path:
          "output/playwright/" +
          width +
          (path === "/" ? "-home" : "-guide") +
          ".png",
        fullPage: true,
        animations: "disabled",
      });
    }
  }

  await page.goto(base + "/");
  await page.waitForFunction(
    () => document.querySelector(".hero").dataset.motion === "running",
  );
  if (
    !(await page.evaluate(() =>
      document.fonts.check('600 96px "Bricolage Grotesque"'),
    ))
  )
    throw new Error("Display font not loaded");
  const initialTransform = await page
    .locator(".floating-object")
    .evaluate((el) => getComputedStyle(el).transform);
  await page.waitForFunction(
    (before) =>
      getComputedStyle(document.querySelector(".floating-object")).transform !==
      before,
    initialTransform,
  );
  await page.getByRole("button", { name: "Pause motion" }).click();
  if (
    (await page
      .locator(".floating-object")
      .evaluate((el) => getComputedStyle(el).animationPlayState)) !== "paused"
  )
    throw new Error("Pause control failed");
  await page.getByRole("button", { name: "Resume motion" }).click();
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () => document.querySelector(".hero").dataset.motion === "paused",
  );
  await page.locator(".hero").scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () => document.querySelector(".hero").dataset.motion === "running",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  if (
    (await page
      .locator(".floating-object")
      .evaluate((el) => getComputedStyle(el).animationName)) !== "none"
  )
    throw new Error("Reduced motion did not stop sculpture");
  if (!(await page.getByRole("button", { name: "Motion off" }).isDisabled()))
    throw new Error("Reduced motion control state");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(base + "/");
  await page
    .getByRole("link", { name: /connect your agent/i })
    .first()
    .click();
  if (!page.url().endsWith("/connect.html"))
    throw new Error("Hero guide navigation failed");
  if (
    await page
      .locator("#technical-details")
      .evaluate((el) => el.hasAttribute("open"))
  )
    throw new Error("Technical details drawer should start closed");
  await page.locator("#technical-details > summary").click();
  const route = page.getByLabel("Your client");
  await route.selectOption("oauth");
  if (
    !(await page.locator("#route-note").textContent()).includes(
      "OAuth and ERC-8128",
    )
  )
    throw new Error("Guide route selector failed");

  await page.goto(base + "/");
  const token = page.getByRole("tab", { name: /What changed/ });
  const wallet = page.getByRole("tab", { name: /Who's buying/ });
  await wallet.click();
  if (
    (await wallet.getAttribute("aria-selected")) !== "true" ||
    (await page.locator("#query-panel").getAttribute("aria-labelledby")) !==
      "tab-wallet"
  )
    throw new Error("Query tab click state failed");
  if (
    !(await page.locator("#example-answer").textContent()).includes(
      "wallet skill",
    )
  )
    throw new Error("Wallet explanation not rendered");
  await wallet.press("ArrowDown");
  if (
    (await page
      .getByRole("tab", { name: /How complete/ })
      .getAttribute("aria-selected")) !== "true"
  )
    throw new Error("Query tab keyboard state failed");
  await token.press("Home");
  if ((await token.getAttribute("aria-selected")) !== "true")
    throw new Error("Query tab Home state failed");

  await page.goto(base + "/connect.html");
  await page.locator("#technical-details > summary").click();
  await page
    .getByText("Expired proof or replay rejected", { exact: true })
    .click();
  if (
    (await page
      .locator(".faqs details")
      .filter({ hasText: "Expired proof or replay rejected" })
      .getAttribute("open")) !== ""
  )
    throw new Error("FAQ did not open");
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: /Copy connection details/ }).click();
  await page.waitForFunction(() =>
    document
      .querySelector("#connection-record-feedback")
      .textContent.includes("copied"),
  );
  const copied = await page.evaluate(
    async () =>
      JSON.parse(await navigator.clipboard.readText()).development_target,
  );
  if (copied !== "http://127.0.0.1:18080/mcp")
    throw new Error("Copy content mismatch");
  await page.evaluate(() =>
    Object.defineProperty(navigator.clipboard, "writeText", {
      value: async () => {
        throw new Error("denied");
      },
      configurable: true,
    }),
  );
  await page.getByRole("button", { name: /Copy connection details/ }).click();
  await page.waitForFunction(() =>
    document
      .querySelector("#connection-record-feedback")
      .textContent.includes("manually"),
  );

  await page.goto(base + "/connect.html");
  const prompt = page.locator("#agent-prompt");
  const renderedPrompt = await prompt.textContent();
  await page.getByRole("button", { name: "Copy General prompt" }).click();
  await page.waitForFunction(() =>
    document
      .querySelector("#agent-prompt-feedback")
      .textContent.includes("Paste it into your agent"),
  );
  if (
    (await page.evaluate(() => navigator.clipboard.readText())).replace(
      /\r\n/g,
      "\n",
    ) !== renderedPrompt
  )
    throw new Error("Prompt copy content mismatch");
  const hermesTab = page.getByRole("tab", { name: "Hermes" });
  await hermesTab.click();
  if (
    (await hermesTab.getAttribute("aria-selected")) !== "true" ||
    !(await page.locator("#prompt-panel-hermes").isVisible()) ||
    (await page.locator("#agent-prompt").isVisible())
  )
    throw new Error("Host prompt tab state failed");
  const hermesPrompt = await page.locator("#prompt-panel-hermes").textContent();
  await page.getByRole("button", { name: "Copy Hermes prompt" }).click();
  if (
    (await page.evaluate(() => navigator.clipboard.readText())).replace(
      /\r\n/g,
      "\n",
    ) !== hermesPrompt
  )
    throw new Error("Active host prompt copy content mismatch");
  await page.evaluate(() =>
    Object.defineProperty(navigator.clipboard, "writeText", {
      value: async () => {
        throw new Error("denied");
      },
      configurable: true,
    }),
  );
  await page.getByRole("button", { name: "Copy Hermes prompt" }).click();
  await page.waitForFunction(() =>
    document
      .querySelector("#agent-prompt-feedback")
      .textContent.includes("manually"),
  );

  await page.goto(base + "/connect.html#tools");
  if (
    !(await page
      .locator("#technical-details")
      .evaluate((el) => el.hasAttribute("open")))
  )
    throw new Error("Technical details deep link did not open drawer");

  await page.emulateMedia({ reducedMotion: "reduce" });
  if (
    (await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    )) !== "auto"
  )
    throw new Error("Reduced motion failed");
  await page.goto(base + "/");
  await page.keyboard.press("Tab");
  if (
    (await page.evaluate(() => document.activeElement.textContent)) !==
    "Skip to content"
  )
    throw new Error("Skip link not first");
  await page.keyboard.press("Enter");
  const external = requests.filter((url) => !url.startsWith(base + "/"));
  if (external.length)
    throw new Error("External requests: " + external.join(","));

  const noJs = await page
    .context()
    .browser()
    .newContext({
      javaScriptEnabled: false,
      viewport: { width: 360, height: 900 },
    });
  const plain = await noJs.newPage();
  for (const path of ["/", "/connect.html"]) {
    await plain.goto(base + path);
    const text = await plain.locator("main").textContent();
    if (path === "/" && !text.includes("Good intel"))
      throw new Error("No-JS home content missing");
    if (path === "/connect.html" && !text.includes("Your agent"))
      throw new Error("No-JS guide content missing");
    if (
      path === "/connect.html" &&
      !(await plain.locator("#agent-prompt").textContent())
    )
      throw new Error("No-JS prompt content missing");
    if (path === "/connect.html") {
      for (const id of [
        "prompt-panel-grok",
        "prompt-panel-hermes",
        "prompt-panel-openclaw",
      ]) {
        if (!(await plain.locator("#" + id).textContent()))
          throw new Error("No-JS host prompt content missing: " + id);
      }
    }
    if (path === "/connect.html") {
      const technicalDetails = plain.locator("#technical-details");
      if (await technicalDetails.evaluate((el) => el.hasAttribute("open")))
        throw new Error("No-JS technical details should start closed");
      await technicalDetails.locator(":scope > summary").click();
      if (!(await technicalDetails.evaluate((el) => el.hasAttribute("open"))))
        throw new Error("No-JS technical details disclosure failed");
    }
    if (
      await plain.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )
    )
      throw new Error("No-JS overflow");
  }
  await noJs.close();
  console.log(
    JSON.stringify({
      layouts: results,
      heroGuide: true,
      tabs: true,
      route: true,
      copySuccess: true,
      copyFailure: true,
      promptCopy: true,
      technicalDetails: true,
      reducedMotion: true,
      skipLink: true,
      noExternalRequests: true,
      noJavaScript: true,
    }),
  );
};
