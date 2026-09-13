async function checkWebsite(page) {
  const base = "http://127.0.0.1:43848";
  const paperSelectors = [
    ".paper-character",
    ".paper-block",
    ".paper-signal",
    ".paper-core",
    ".paper-emphasis",
  ];
  const results = [];
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.emulateMedia({ reducedMotion: "no-preference" });

  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/connect.html"]) {
      await page.goto(base + path);
      await page.evaluate(() => document.fonts.ready);
      const metrics = await page.evaluate(() => ({
        width: innerWidth,
        content: document.documentElement.scrollWidth,
        h1: document.querySelectorAll("h1").length,
        paperScene: (() => {
          const scene = document.querySelector("svg.paper-scene");
          if (!scene) return null;
          const rect = scene.getBoundingClientRect();
          return {
            left: rect.left,
            right: rect.right,
            width: rect.width,
            height: rect.height,
          };
        })(),
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
        (metrics.paperScene &&
          (metrics.paperScene.width <= 0 ||
            metrics.paperScene.height <= 0 ||
            metrics.paperScene.left < -1 ||
            metrics.paperScene.right > width + 1)) ||
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
      if (path === "/" && (width === 360 || width === 1440)) {
        await page.screenshot({
          path: `output/playwright/${width}-home-viewport.png`,
          animations: "disabled",
        });
      }
    }
  }

  await page.goto(base + "/");
  if ((await page.locator("svg.paper-scene").count()) !== 1)
    throw new Error("Inline paper scene missing");
  if (
    (await page
      .getByRole("img", { name: /Three connected Gossip paper mascots/ })
      .count()) !== 1
  )
    throw new Error("Inline paper scene accessible name missing");
  await page.waitForFunction(
    () => document.querySelector(".hero").dataset.motion === "running",
  );
  if (
    !(await page.evaluate(() =>
      document.fonts.check('600 96px "Bricolage Grotesque"'),
    ))
  )
    throw new Error("Display font not loaded");
  const readPaperTimes = (selectors, waitForFrame = false) =>
    page.evaluate(
      async ({ classSelectors, waitForFrame: shouldWait }) => {
        if (shouldWait) {
          await new Promise(requestAnimationFrame);
          await new Promise(requestAnimationFrame);
        }
        return classSelectors.flatMap((selector) =>
          [...document.querySelectorAll(selector)].flatMap((element) =>
            [...element.getAnimations()].map(
              (animation) => animation.currentTime,
            ),
          ),
        );
      },
      { classSelectors: selectors, waitForFrame },
    );
  const countAnimationTimeChanges = (before, after) =>
    before.filter(
      (time, index) =>
        Number.isFinite(time) &&
        Number.isFinite(after[index]) &&
        Math.abs(after[index] - time) > 0.1,
    ).length;
  const hasAnimationTimeChange = (before, after) =>
    countAnimationTimeChanges(before, after) > 0;
  const waitForPaperState = async (state) =>
    page.waitForFunction(
      ({ selectors, expectedState }) => {
        const elements = selectors.flatMap((selector) => [
          ...document.querySelectorAll(selector),
        ]);
        const animations = elements.flatMap((element) => [
          ...element.getAnimations(),
        ]);
        return (
          animations.length > 0 &&
          animations.every((animation) => animation.playState === expectedState)
        );
      },
      { selectors: paperSelectors, expectedState: state },
    );
  await page.waitForFunction((selectors) => {
    const characters = [...document.querySelectorAll(".paper-character")];
    return (
      characters.length === 3 &&
      characters.every(
        (element) =>
          getComputedStyle(element).animationName !== "none" &&
          element
            .getAnimations()
            .some((animation) => animation.playState === "running"),
      ) &&
      selectors.every((selector) => {
        const elements = [...document.querySelectorAll(selector)];
        return (
          elements.length > 0 &&
          elements.every((element) => element.getAnimations().length > 0)
        );
      })
    );
  }, paperSelectors);
  const characterBefore = await readPaperTimes([".paper-character"]);
  const characterAfter = await readPaperTimes([".paper-character"], true);
  if (countAnimationTimeChanges(characterBefore, characterAfter) < 2)
    throw new Error("Multiple paper character animations did not run");
  if (
    (await page
      .locator(".floating-object")
      .evaluate((el) => getComputedStyle(el).animationName)) !== "none"
  )
    throw new Error("Floating object should remain static");
  await page.getByRole("button", { name: "Pause motion" }).click();
  await waitForPaperState("paused");
  const pausedBefore = await readPaperTimes(paperSelectors);
  const pausedAfter = await readPaperTimes(paperSelectors, true);
  if (hasAnimationTimeChange(pausedBefore, pausedAfter))
    throw new Error("Pause control did not freeze paper animations");
  await page.getByRole("button", { name: "Resume motion" }).click();
  await waitForPaperState("running");
  const resumedBefore = await readPaperTimes(paperSelectors);
  const resumedAfter = await readPaperTimes(paperSelectors, true);
  if (!hasAnimationTimeChange(resumedBefore, resumedAfter))
    throw new Error("Resume control did not restart paper animations");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () => document.querySelector(".hero").dataset.motion === "paused",
  );
  await waitForPaperState("paused");
  await page.locator(".hero").scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () => document.querySelector(".hero").dataset.motion === "running",
  );
  await waitForPaperState("running");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction((selectors) => {
    const elements = selectors.flatMap((selector) => [
      ...document.querySelectorAll(selector),
    ]);
    return (
      document.querySelector(".hero").dataset.motion === "paused" &&
      elements.length > 0 &&
      elements.every(
        (element) =>
          getComputedStyle(element).animationName === "none" &&
          element
            .getAnimations()
            .every((animation) => animation.playState !== "running"),
      )
    );
  }, paperSelectors);
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
  const assertPromptsLocked = async (currentPage) => {
    if (
      !(await currentPage.locator("#prompt-access-form").isVisible()) ||
      (await currentPage.locator(".prompt-tabs").isVisible()) ||
      (await currentPage.locator(".prompt-panels").isVisible()) ||
      (await currentPage.locator('[data-copy="agent-prompt"]').isVisible())
    )
      throw new Error("Protected prompt controls should remain locked");
    for (const panel of await currentPage
      .locator("[data-prompt-panel]")
      .all()) {
      if ((await panel.textContent()).trim())
        throw new Error("Locked page contains protected prompt content");
    }
  };
  await assertPromptsLocked(page);

  // API authorization is checked in checks.test.mjs; these fixtures exercise the UI.
  const fixturePrompts = {
    general: "Synthetic General prompt\nBrowser clipboard fixture.",
    grok: "Synthetic Grok prompt\nBrowser clipboard fixture.",
    hermes: "Synthetic Hermes prompt\nBrowser clipboard fixture.",
    openclaw: "Synthetic OpenClaw prompt\nBrowser clipboard fixture.",
  };
  await page.route(base + "/api/setup-prompt", async (route) => {
    const request = route.request();
    if (request.method() !== "POST")
      throw new Error("Prompt unlock must use POST");
    const authorized = request.postDataJSON().password === "browser-fixture";
    await route.fulfill({
      status: authorized ? 200 : 401,
      contentType: "application/json",
      body: JSON.stringify(
        authorized ? { prompts: fixturePrompts } : { error: "Unauthorized" },
      ),
    });
  });
  await page.getByLabel("Access password").fill("incorrect-fixture");
  await page.getByRole("button", { name: "Unlock prompts" }).click();
  await page.waitForFunction(() =>
    document
      .querySelector("#prompt-access-feedback")
      .textContent.includes("Incorrect password"),
  );
  await assertPromptsLocked(page);
  await page.getByLabel("Access password").fill("browser-fixture");
  await page.getByRole("button", { name: "Unlock prompts" }).click();
  await prompt.waitFor({ state: "visible" });
  if ((await prompt.textContent()) !== fixturePrompts.general)
    throw new Error("Unlocked prompt fixture mismatch");
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
  await page.reload();
  await assertPromptsLocked(page);
  await page.unroute(base + "/api/setup-prompt");

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
    if (path === "/connect.html") {
      await assertPromptsLocked(plain);
      if (
        !text.includes(
          "JavaScript is required to request the protected installation prompts",
        )
      )
        throw new Error("No-JS protected prompt explanation missing");
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
    if (path === "/") {
      const defaultMotion = await plain.evaluate((selectors) => {
        const elements = selectors.flatMap((selector) => [
          ...document.querySelectorAll(selector),
        ]);
        return {
          scene: document.querySelector("svg.paper-scene") !== null,
          animations: elements.flatMap((element) =>
            [...element.getAnimations()].map(
              (animation) => animation.playState,
            ),
          ),
        };
      }, paperSelectors);
      if (
        !defaultMotion.scene ||
        defaultMotion.animations.length === 0 ||
        defaultMotion.animations.some((playState) => playState !== "paused")
      )
        throw new Error("Paper animations should start paused");
    }
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
      promptGate: true,
      technicalDetails: true,
      reducedMotion: true,
      skipLink: true,
      noExternalRequests: true,
      noJavaScript: true,
    }),
  );
}
