import { expect, test } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

test('legacy passage links, Korean verse search, and invalid state recovery work at the deployment base', async ({ page }) => {
  await page.goto('?thread=cross&passage=jn-20-24')
  await expect(page.getByRole('heading', { level: 1, name: '나의 주, 나의 하나님' })).toBeVisible()
  await expect(page.locator('.navigation-notice')).toContainText('이전에 공유한 본문')
  const search = page.getByRole('searchbox')
  await search.fill('요한복음 20:24')
  await search.press('Enter')
  await expect(page).toHaveURL(/view=search/)
  await page.locator('.document-row').filter({ has: page.getByRole('heading', { name: '나의 주, 나의 하나님' }) }).click()
  await expect(page).toHaveURL(/doc=jn-20-24/)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: '나의 주, 나의 하나님' })).toBeVisible()
  await page.goto('?doc=story&state=not-a-scene')
  await expect(page.locator('.navigation-notice')).toContainText('처음 상태로 열었습니다')
  await expect(page.getByRole('heading', { name: '떠남', exact: true })).toBeVisible()
})

test('home opens seventeen question paths and a question reveals sources and deep reading', async ({ page }) => {
  await page.goto('./')
  await expect(page.locator('#questions .question-card')).toHaveCount(17)
  await page.getByRole('link', { name: /잘해야만 사랑받을 수 있을까/ }).click()
  await expect(page.getByRole('heading', { level: 1, name: '잘해야만 사랑받을 수 있을까?' })).toBeVisible()
  await page.getByText('깊은 읽기와 해석의 근거').click()
  await expect(page.locator('.deep-reading[open]')).toBeVisible()
  await expect(page.getByRole('link', { name: /누가복음 15:1–32/ })).toHaveAttribute('href', /bible\.bskorea\.or\.kr/)
  await page.getByRole('link', { name: /The Prodigal Sons/ }).click()
  await expect(page.getByRole('heading', { level: 1, name: /The Prodigal Sons/ })).toBeVisible()
})

test('church hurt material keeps safety and responsibility in view while the perspective state is shareable', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('?doc=church-hurt')
  await expect(page.getByRole('heading', { level: 1, name: '교회에 실망했는데 예수를 알아볼 수 있을까?' })).toBeVisible()
  await expect(page.getByText(/안전과 책임/).first()).toBeVisible()
  const choices = page.getByRole('group', { name: '상황과 관점 선택' })
  await choices.getByRole('button', { name: '용서 · 은혜의 응답' }).click()
  await expect(page).toHaveURL(/state=forgiveness-grace/)
  await expect(page.getByText(/관계 복귀를 자동으로 요구하지 않습니다/)).toBeVisible()
  await page.getByRole('button', { name: '이 페이지 공유' }).click()
  await expect(page.getByRole('button', { name: '링크 복사됨' })).toBeVisible()
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(copied).toContain('doc=church-hurt')
  expect(copied).toContain('state=forgiveness-grace')
  await page.reload()
  await expect(page.getByRole('heading', { name: '용서 · 은혜의 응답' })).toBeVisible()
})

test('the resurrection evidence page exposes its passage connections and citation grounds', async ({ page }) => {
  await page.goto('?doc=evidence')
  await expect(page.getByRole('heading', { level: 1, name: '예수와 부활을 믿을 이유가 있을까?' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '부활의 증언과 그 의미' })).toBeVisible()
  await page.getByRole('button', { name: '약속과 성취', exact: true }).click()
  await expect(page).toHaveURL(/state=promise/)
  await expect(page.getByRole('heading', { name: '부활에서 오는 소망' })).toBeVisible()
  await expect(page.locator('.le-evidence')).toContainText('고린도전서 15:20–23')
  await expect(page.getByText(/현재의 상실과 애도를 생략하라는 뜻은 아닙니다/).first()).toBeVisible()
})

test('story scene changes, reset, browser back, and reload preserve URL state', async ({ page }) => {
  await page.goto('?doc=story')
  const scenes = page.getByRole('group', { name: '이야기 장면' })
  await scenes.getByRole('button', { name: /형의 분노/ }).click()
  await expect(page).toHaveURL(/state=resentment/)
  await page.reload()
  await expect(page.getByRole('heading', { name: '형의 분노' })).toBeVisible()
  await page.getByRole('button', { name: '처음부터 다시 살펴보기' }).click()
  await expect(page).toHaveURL(/state=leaving/)
  await page.goBack()
  await expect(page).toHaveURL(/state=resentment/)
  await expect(page.getByRole('heading', { name: '형의 분노' })).toBeVisible()
})

test('connections can be filtered and reset to the complete map', async ({ page }) => {
  await page.goto('?doc=connections')
  await page.getByRole('button', { name: '주제의 연결', exact: true }).click()
  await expect(page).toHaveURL(/state=theme/)
  await expect(page.getByRole('heading', { name: '주제의 연결' })).toBeVisible()
  await page.getByRole('button', { name: '모든 연결' }).click()
  await expect(page).toHaveURL(/state=all/)
  await expect(page.getByRole('heading', { name: '모든 연결' })).toBeVisible()
})

test('layers support keyboard adjustment, text mode, and state restoration', async ({ page }) => {
  await page.goto('?doc=layers')
  const range = page.getByRole('slider')
  await range.focus()
  await range.press('ArrowRight')
  await range.press('ArrowRight')
  await expect(page).toHaveURL(/state=faith/)
  await expect(page.getByRole('heading', { name: '믿음으로 받음' })).toBeVisible()
  await page.getByRole('button', { name: '글로 보기' }).click()
  await expect(page.locator('.le-visual-panel')).toHaveCount(0)
  await page.getByText('그림 없이 내용 전체 읽기').click()
  await expect(page.locator('.le-text-alternative[open]')).toContainText('믿음으로 받음')
  await page.reload()
  await expect(page.getByRole('heading', { name: '믿음으로 받음' })).toBeVisible()
})

test('all thirteen experience pages cover the four learning modes in the direct exploration collection', async ({ page }) => {
  await page.goto('?view=experiences')
  await expect(page.getByRole('heading', { level: 1, name: '읽고, 움직이고, 발견하다' })).toBeVisible()
  await expect(page.locator('.question-card')).toHaveCount(13)
  for (const title of ['두 아들과 아버지의 이야기', '유월절과 예수의 십자가', '은혜와 변화의 관계', '실패와 비판, 용서를 바라보는 두 관점', '부활의 증언과 그 의미', '주기도문의 흐름 따라 읽기', '기다림과 말없음의 두 관점']) {
    await expect(page.getByRole('link', { name: new RegExp(title) })).toBeVisible()
  }
})

test('home, church hurt, and an interactive map fit the selected mobile or desktop viewport', async ({ page }) => {
  for (const path of ['./', '?doc=church-hurt', '?doc=connections', '?view=library', '?doc=study-galatians-freedom', '?doc=conscience-table', '?doc=return-to-grace-7-days&day=day-4']) {
    await page.goto(path)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1)
  }
})

test('captures review screenshots for the main reading routes', async ({ page }, testInfo) => {
  await mkdir('artifacts', { recursive: true })
  const routes = [
    ['./', 'home'],
    ['?doc=acceptance', 'acceptance'],
    ['?doc=church-hurt', 'church-hurt'],
    ['?doc=evidence', 'evidence'],
    ['?view=library', 'library'],
    ['?doc=study-galatians-freedom', 'galatians-study'],
    ['?doc=return-to-grace-7-days&day=day-4', 'daily-guide'],
  ] as const
  for (const [path, name] of routes) {
    await page.goto(path)
    await expect(page.locator('main')).toBeVisible()
    await page.screenshot({ path: `artifacts/${testInfo.project.name}-${name}.png`, fullPage: true })
  }
})


test('book reading paths link to passages, source scope and the installed Logos resource', async ({ page }) => {
  await page.goto('?view=library')
  await expect(page.locator('.question-card')).toHaveCount(7)
  await page.getByRole('link', { name: /갈라디아서: 은혜가 낳는 자유와 열매/ }).click()
  await expect(page.getByRole('heading', { level: 1, name: '갈라디아서: 은혜가 낳는 자유와 열매' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '복음의 자유와 이웃 사랑' })).toBeVisible()
  await page.getByRole('button', { name: '짐을 함께 나눔', exact: true }).click()
  await expect(page).toHaveURL(/state=burden/)
  await page.reload()
  await expect(page.getByRole('heading', { name: '짐을 함께 나눔', exact: true })).toBeVisible()
  await page.getByRole('complementary').getByRole('link', { name: /팀 켈러, 당신을 위한 갈라디아서/ }).click()
  await expect(page.getByRole('heading', { name: '한국어판에서 직접 확인한 범위' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Logos에서 책 열기' })).toHaveAttribute('href', 'logosres:gwfykor69ga')
  await expect(page.getByText(/한국어판 전체를 읽은 것은 아니며/)).toBeVisible()
})

test('new scenarios can be adjusted and restored using every exploration mode', async ({ page }) => {
  const cases = [
    ['judges-cycle', '이야기 장면', '더 깊은 구원의 필요', 'need'],
    ['story-timeline', '이야기 장면', '새 창조의 소망', 'renewal'],
    ['belonging-practice', '상황과 관점 선택', '필요와 경계를 묻는 돌봄', 'care'],
    ['conscience-table', '상황과 관점 선택', '이웃을 세우는 자유', 'love'],
  ] as const
  for (const [id, group, label, state] of cases) {
    await page.goto(`?doc=${id}`)
    await page.getByRole('group', { name: group }).getByRole('button', { name: new RegExp(label) }).click()
    await expect(page).toHaveURL(new RegExp(`state=${state}`))
    await page.reload()
    await expect(page.getByRole('heading', { name: label, exact: true })).toBeVisible()
    await page.getByRole('button', { name: '처음부터 다시 살펴보기' }).click()
    await expect(page.getByRole('heading', { name: label, exact: true })).toHaveCount(0)
  }
  await page.goto('?doc=romans-grace')
  await page.getByRole('slider').focus()
  await page.getByRole('slider').press('End')
  await expect(page).toHaveURL(/state=grace/)
  await page.reload()
  await expect(page.getByRole('heading', { name: '그리스도 안의 의', exact: true })).toBeVisible()
})


test('search still finds body prose and interactive state descriptions after payload reduction', async ({ page }) => {
  await page.goto('./')
  const search = page.getByRole('searchbox')
  await search.fill('인정·편안함·통제')
  await search.press('Enter')
  await page.locator('.document-row').filter({ has: page.getByRole('heading', { name: /당신을 위한 갈라디아서/ }) }).click()
  await expect(page.getByRole('heading', { name: '한국어판에서 직접 확인한 범위' })).toBeVisible()
  await search.fill('필요와 경계를 묻는 돌봄')
  await search.press('Enter')
  await expect(page.locator('.document-row')).toHaveCount(1)
  await page.locator('.document-row').click()
  await expect(page).toHaveURL(/doc=belonging-practice/)
  await expect(page.getByRole('group', { name: '상황과 관점 선택' }).getByRole('button', { name: '필요와 경계를 묻는 돌봄' })).toBeVisible()
})


test('a selected reading day is shareable and explicit read marks survive reload and browser back', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('?view=guides')
  await expect(page.locator('.question-card')).toHaveCount(3)
  await page.getByRole('link', { name: /은혜로 하루를 다시 시작하기/ }).click()
  const days = page.getByRole('group', { name: '읽을 날 선택' })
  await days.getByRole('button', { name: /3일/ }).click()
  await expect(page).toHaveURL(/day=day-3/)
  await page.getByRole('button', { name: '읽은 날 표시', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('1일 읽음')
  await page.getByRole('button', { name: '이 페이지 공유' }).click()
  await expect(page.getByRole('button', { name: '링크 복사됨' })).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('day=day-3')
  await page.reload()
  await expect(page.getByRole('button', { name: '읽은 날 표시 취소' })).toBeVisible()
  await page.locator('.guide-reading-links').getByRole('link', { name: /성경 본문/ }).click()
  await expect(page).toHaveURL(/doc=jdg-2-6/)
  await page.goBack()
  await expect(page).toHaveURL(/day=day-3/)
  await expect(page.getByRole('button', { name: '읽은 날 표시 취소' })).toBeVisible()
  await page.getByRole('button', { name: '읽은 날 표시 취소' }).click()
  await expect(page.getByRole('status')).toHaveText('0일 읽음')
})

test('guides allow keyboard selection, recover invalid dates, and keep read marks separate', async ({ page }) => {
  await page.goto('?doc=return-to-grace-7-days&day=day-4')
  await page.getByRole('button', { name: '읽은 날 표시', exact: true }).click()
  await page.goto('?doc=explore-christianity-7-days&day=unknown')
  await expect(page.getByText('읽을 날을 찾을 수 없어 첫날로 열었습니다.')).toBeVisible()
  await expect(page.getByRole('heading', { name: '선한 창조', exact: true })).toBeVisible()
  await expect(page.locator('.guide-actions [role=status]')).toHaveText('0일 읽음')
  const last = page.getByRole('group', { name: '읽을 날 선택' }).getByRole('button', { name: /7일/ })
  await last.focus()
  await last.press('Enter')
  await expect(page).toHaveURL(/day=day-7/)
  await expect(page.getByRole('button', { name: '다음 날', exact: true })).toBeDisabled()
  await page.goto('?doc=church-disappointed-cautious-7-days&day=day-6')
  await expect(page.locator('.guide-reflection')).toContainText('용서와 신뢰 회복')
  await expect(page.locator('.guide-day-content')).toContainText('강제된 관계 회복')
})

test('home loads no article or search payload and search fetches one shared index', async ({ page }) => {
  const payloads: string[] = []
  page.on('request', request => { if (request.url().includes('/generated-content/')) payloads.push(request.url()) })
  await page.goto('./')
  await expect(page.locator('#questions .question-card')).toHaveCount(17)
  expect(payloads).toEqual([])
  await page.getByRole('searchbox').fill('은혜')
  await page.getByRole('searchbox').press('Enter')
  await expect(page.locator('.document-row').first()).toBeVisible()
  expect(payloads).toHaveLength(1)
  await page.getByRole('searchbox').fill('부활')
  await page.getByRole('searchbox').press('Enter')
  await expect(page.getByRole('heading', { name: '“부활” 찾기' })).toBeVisible()
  await expect(page.locator('.document-row').first()).toBeVisible()
  expect(payloads).toHaveLength(1)
})

test('a delayed article cannot replace a newer reading selection or a collection', async ({ page }) => {
  let release!: () => void
  let entered!: () => void
  const requested = new Promise<void>(resolve => { entered = resolve })
  const gate = new Promise<void>(resolve => { release = resolve })
  await page.route('**/generated-content/*.json', async route => {
    const response = await route.fetch()
    const value = await response.json()
    if (value.publicId === 'acceptance') { entered(); await gate }
    await route.fulfill({ response })
  })
  await page.goto('?doc=acceptance')
  await requested
  await page.getByRole('link', { name: '자료와 출처', exact: true }).first().click()
  await expect(page.getByRole('heading', { name: '근거를 따라 더 깊이 읽다' })).toBeVisible()
  release()
  await expect(page.locator('.reading-body')).toHaveCount(0)
  await page.evaluate(() => { history.pushState({}, '', '?doc=church-hurt'); dispatchEvent(new PopStateEvent('popstate')) })
  await expect(page.locator('.reading-body h1')).toHaveText('교회에 실망했는데 예수를 알아볼 수 있을까?')
  await expect(page.locator('.reading-body')).not.toContainText('잘해야만 사랑받을 수 있을까?')
})

test('failed detail and search requests show retry and recover without losing the address', async ({ page }) => {
  let failures = 0
  await page.route('**/generated-content/*.json', async route => {
    const response = await route.fetch(), value = await response.json()
    if (value.publicId === 'story' && failures++ === 0) return route.fulfill({ status: 503, body: 'unavailable' })
    await route.fulfill({ response })
  })
  await page.goto('?doc=story&state=resentment')
  await expect(page.getByRole('alert')).toContainText('자료를 불러오지 못했습니다')
  await expect(page.getByRole('button', { name: '페이지 새로고침' })).toBeVisible()
  await page.getByRole('button', { name: '다시 시도', exact: true }).click()
  await expect(page.getByRole('heading', { name: '형의 분노', exact: true })).toBeVisible()
  await expect(page).toHaveURL(/state=resentment/)
  await page.unrouteAll()
  let indexFailures = 0
  await page.route('**/generated-content/*.json', async route => {
    const response = await route.fetch(), value = await response.json()
    if (value.rows && indexFailures++ === 0) return route.fulfill({ status: 503, body: 'unavailable' })
    await route.fulfill({ response })
  })
  await page.getByRole('searchbox').fill('은혜')
  await page.getByRole('searchbox').press('Enter')
  await expect(page.getByRole('alert')).toBeVisible()
  await page.getByRole('button', { name: '다시 시도', exact: true }).click()
  await expect(page.locator('.document-row').first()).toBeVisible()
})

test('experience state changes preserve text mode and do not fetch details again', async ({ page }) => {
  const requests: string[] = []
  page.on('request', request => { if (request.url().includes('/generated-content/')) requests.push(request.url()) })
  await page.goto('?doc=story')
  await page.getByRole('button', { name: '글로 보기', exact: true }).click()
  const count = requests.length
  await page.getByRole('group', { name: '이야기 장면' }).getByRole('button', { name: /형의 분노/ }).click()
  await expect(page.getByRole('button', { name: '그림 보기', exact: true })).toBeVisible()
  await expect(page.locator('.le-visual-panel')).toHaveCount(0)
  expect(requests).toHaveLength(count)
  expect(new Set(requests).size).toBe(requests.length)
})

test('late article responses cannot overwrite the next article', async ({ page }) => {
  let release!: () => void, entered!: () => void, delayedUrl = ''
  const waiting = new Promise<void>(resolve => { entered = resolve }), gate = new Promise<void>(resolve => { release = resolve })
  await page.route('**/generated-content/*.json', async route => {
    const response = await route.fetch(), value = await response.json()
    if (value.publicId === 'acceptance') { delayedUrl = route.request().url(); entered(); await gate }
    await route.fulfill({ response })
  })
  await page.goto('?doc=acceptance')
  await waiting
  await page.evaluate(() => { history.pushState({}, '', '?doc=church-hurt'); dispatchEvent(new PopStateEvent('popstate')) })
  await expect(page.locator('.reading-body h1')).toHaveText('교회에 실망했는데 예수를 알아볼 수 있을까?')
  const late = page.waitForResponse(response => response.url() === delayedUrl)
  release()
  await (await late).finished()
  await expect(page.locator('.reading-body h1')).toHaveText('교회에 실망했는데 예수를 알아볼 수 있을까?')
})

test('changing query while the shared index loads shows only the current results', async ({ page }) => {
  let release!: () => void, entered!: () => void
  const waiting = new Promise<void>(resolve => { entered = resolve }), gate = new Promise<void>(resolve => { release = resolve })
  let requests = 0
  await page.route('**/generated-content/*.json', async route => {
    const response = await route.fetch(), value = await response.json()
    if (value.rows) { requests++; entered(); await gate }
    await route.fulfill({ response })
  })
  await page.goto('?view=search&q=은혜')
  await waiting
  await page.getByRole('searchbox').fill('필요와 경계를 묻는 돌봄')
  await page.getByRole('searchbox').press('Enter')
  await expect(page.getByRole('heading', { name: '“필요와 경계를 묻는 돌봄” 찾기' })).toBeVisible()
  release()
  await expect(page.locator('.document-row').first()).toBeVisible()
  expect(requests).toBe(1)
  await expect(page.locator('.document-row')).toHaveCount(1)
  await expect(page.locator('.document-row')).toHaveAttribute('href', '?doc=belonging-practice')
})


test('reading paths load their complete connection evidence without fetching linked passage bodies', async ({ page }) => {
  const requests: string[] = []
  page.on('request', request => { if (request.url().includes('/generated-content/')) requests.push(request.url()) })
  await page.goto('?doc=path-cross')
  await expect(page.getByRole('heading', { name: '연결을 따라 읽기' })).toBeVisible()
  const relations = page.locator('.relation-options button')
  const count = await relations.count()
  expect(count).toBeGreaterThan(0)
  expect(requests).toHaveLength(count + 1)
  await relations.first().click()
  await expect(page.locator('.relation-detail')).toContainText('근거:')
  await page.locator('.relation-detail a').click()
  await expect(page.locator('.source-section')).toBeVisible()
  await page.goBack()
  await expect(page.getByRole('heading', { name: '연결을 따라 읽기' })).toBeVisible()
})


test('losing the connection after opening home fails safely and retries after reconnection', async ({ page, context }) => {
  await page.goto('./')
  await expect(page.locator('#questions .question-card')).toHaveCount(17)
  await context.setOffline(true)
  await page.getByRole('link', { name: /잘해야만 사랑받을 수 있을까/ }).click()
  await expect(page.getByRole('alert')).toBeVisible()
  await expect(page.locator('.reading-body')).toHaveCount(0)
  await context.setOffline(false)
  await page.getByRole('button', { name: '다시 시도', exact: true }).click()
  await expect(page.locator('.reading-body h1')).toHaveText('잘해야만 사랑받을 수 있을까?')
  await expect(page.getByRole('heading', { name: '복음으로 읽기' })).toBeVisible()
})


test('prayer questions open their intended state, share and restore exploration, and link the three-session study', async ({ page, context }, testInfo) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('?doc=prayer-start')
  await expect(page.getByRole('heading', { level: 1, name: '기도를 어떻게 시작할 수 있을까?' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '아버지께 나아감', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: '주기도문의 여섯 초점' })).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1)
  const viewportName = testInfo.project.name.startsWith('mobile') ? 'mobile' : 'desktop'
  await page.screenshot({ path: `/tmp/bibe-prayer-${viewportName}.png`, fullPage: true })
  const prayerSteps = page.getByRole('group', { name: '이야기 장면' })
  await prayerSteps.getByRole('button', { name: /나라와 뜻을 구함/ }).click()
  await expect(page).toHaveURL(/state=kingdom/)
  await page.getByRole('button', { name: '이 페이지 공유' }).click()
  await expect(page.getByRole('button', { name: '링크 복사됨' })).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('state=kingdom')
  await page.reload()
  await expect(page.getByRole('heading', { name: '나라와 뜻을 구함', exact: true })).toBeVisible()
  await page.getByRole('button', { name: '처음부터 다시 살펴보기' }).click()
  await expect(page).toHaveURL(/state=father/)

  await page.goto('?doc=unanswered-prayer')
  await expect(page.getByRole('heading', { name: '기다림 · 관계 안에서 말함', exact: true })).toBeVisible()
  const perspectives = page.getByRole('group', { name: '상황과 관점 선택' })
  await perspectives.getByRole('button', { name: '기다림 · 거래처럼 느껴짐' }).click()
  await expect(page).toHaveURL(/state=waiting-bargain/)
  await page.reload()
  await expect(page.getByRole('heading', { name: '기다림 · 거래처럼 느껴짐', exact: true })).toBeVisible()
  await page.getByRole('button', { name: '처음부터 다시 살펴보기' }).click()
  await expect(page).toHaveURL(/state=waiting-relationship/)
  await page.goto('?doc=prayer-silence')
  await expect(page.getByRole('heading', { name: '말없음 · 연약함을 맡김', exact: true })).toBeVisible()

  await page.goto('?doc=study-prayer-with-scripture')
  for (const title of ['예수께서 가르치신 기도의 방향', '기다림과 겟세마네의 기도', '말로 다 못 하는 연약함']) {
    await expect(page.getByRole('heading', { level: 2, name: new RegExp(title) })).toBeVisible()
  }
  await page.goto('?view=search&q=성령의%20도우심')
  await expect(page.getByRole('heading', { name: '“성령의 도우심” 찾기' })).toBeVisible()
  await expect(page.locator('.document-row').filter({ hasText: '말이 나오지 않을 때도 기도할 수 있을까?' })).toBeVisible()
})

test('concept previews are modal, preserve the reading location, and restore focus', async ({ page }, testInfo) => {
  await page.goto('?doc=acceptance&state=criticism-grace')
  await expect(page.locator('.reading-body')).toBeVisible()
  const conceptLink = page.locator('.reading-body a[data-doc="concepts/grace"][aria-haspopup="dialog"]').first()
  await expect(conceptLink).toBeVisible()
  await conceptLink.scrollIntoViewIfNeeded()
  const originalUrl = page.url()
  const originalScroll = await page.evaluate(() => window.scrollY)
  const href = await conceptLink.getAttribute('href')
  await conceptLink.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(page.getByRole('button', { name: '말뜻 설명 닫기' })).toBeFocused()
  await expect.poll(() => page.evaluate(() => window.location.href)).toBe(originalUrl)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(originalScroll)
  await expect(dialog.getByRole('heading', { level: 2 })).toBeVisible()
  await expect(dialog.locator('.concept-definition')).not.toBeEmpty()
  await expect(dialog.getByText('설명의 근거와 원자료')).toBeVisible()
  await page.keyboard.press('Tab')
  await expect.poll(() => page.evaluate(() => document.activeElement?.closest('dialog') !== null)).toBe(true)
  await page.keyboard.press('Shift+Tab')
  await expect(page.getByRole('button', { name: '말뜻 설명 닫기' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(conceptLink).toBeFocused()
  expect(page.url()).toBe(originalUrl)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(originalScroll)
  expect(href).toBe('?doc=grace')

  await conceptLink.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1)
  await page.screenshot({ path: `artifacts/concept-preview-${testInfo.project.name}.png` })
  await page.getByRole('button', { name: '말뜻 설명 닫기' }).click()
  await expect(conceptLink).toBeFocused()

  await page.goto('?doc=return-to-grace-7-days&day=day-4')
  const guideConceptLink = page.locator('.reading-body a[data-doc="concepts/grace"][aria-haspopup="dialog"]').first()
  await expect(guideConceptLink).toBeVisible()
  const guideUrl = page.url()
  await guideConceptLink.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog')).toBeVisible()
  expect(page.url()).toBe(guideUrl)
  await page.getByRole('button', { name: '말뜻 설명 닫기' }).click()
  await expect(guideConceptLink).toBeFocused()
  expect(page.url()).toBe(guideUrl)
})

test('concept preview source footnotes reveal their matching source without navigation', async ({ page }) => {
  await page.goto('?doc=acceptance&state=criticism-grace')
  const conceptLink = page.locator('.reading-body a[data-doc="concepts/grace"][aria-haspopup="dialog"]').first()
  await expect(conceptLink).toBeVisible()
  const originalUrl = page.url()
  await conceptLink.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.locator('.concept-preview-sources')).toBeVisible()
  const footnote = dialog.locator('.prose a[href^="#concept-source-"]').first()
  await expect(footnote).toBeVisible()
  const sourceId = (await footnote.getAttribute('href'))!.slice(1)
  await footnote.click()
  await expect(dialog.locator('.concept-preview-sources[open]')).toBeVisible()
  await expect(dialog.locator(`#${sourceId}`)).toBeFocused()
  expect(page.url()).toBe(originalUrl)
  const sourceLink = dialog.locator('#concept-source-keller-wisdom-grace a')
  await expect(sourceLink).toHaveAttribute('href', '?doc=keller-wisdom-grace')
  const popupPromise = page.waitForEvent('popup')
  await sourceLink.click()
  const popup = await popupPromise
  await expect(popup.locator('.reading-body h1')).toHaveText('Wisdom from the Letters of John Newton')
  await popup.close()
  await expect(dialog).toBeVisible()
  expect(page.url()).toBe(originalUrl)
})

test('a concept preview can follow another term and close back to its original inline link', async ({ page }) => {
  await page.goto('?doc=acceptance&state=criticism-grace')
  const originalUrl = page.url()
  const deepReading = page.locator('.reading-body details').filter({ hasText: '깊은 읽기와 해석의 근거' })
  await deepReading.locator('summary').click()
  const justification = deepReading.locator('a[data-doc="concepts/justification"][aria-haspopup="dialog"]')
  await expect(justification).toBeVisible()
  await justification.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('heading', { level: 2, name: '칭의' })).toBeVisible()
  await dialog.locator('a[data-doc="concepts/sanctification"][aria-haspopup="dialog"]').click()
  await expect(dialog.getByRole('heading', { level: 2, name: '성화' })).toBeVisible()
  await expect(page.getByRole('button', { name: '말뜻 설명 닫기' })).toBeFocused()
  await page.getByRole('button', { name: '말뜻 설명 닫기' }).click()
  await expect(dialog).toHaveCount(0)
  await expect(justification).toBeFocused()
  expect(page.url()).toBe(originalUrl)
})

test('concept detail loads only on click, is cached on reopen, and full-page navigation restores the reading state', async ({ page }) => {
  const requests: string[] = []
  page.on('request', request => { if (request.url().includes('/generated-content/')) requests.push(request.url()) })
  await page.goto('?doc=acceptance&state=criticism-grace')
  const conceptLink = page.locator('.reading-body a[data-doc="concepts/grace"][aria-haspopup="dialog"]').first()
  await expect(conceptLink).toBeVisible()
  const countBeforePreview = requests.length
  expect(countBeforePreview).toBeGreaterThan(0)
  await conceptLink.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.locator('.concept-preview-sources')).toBeVisible()
  const countAfterLoad = requests.length
  expect(countAfterLoad).toBe(countBeforePreview + 1)
  await dialog.getByRole('button', { name: '말뜻 설명 닫기' }).click()
  await conceptLink.click()
  await expect(dialog.locator('.concept-preview-sources')).toBeVisible()
  expect(requests).toHaveLength(countAfterLoad)
  const conceptTitle = await dialog.getByRole('heading', { level: 2 }).textContent()
  await dialog.getByRole('link', { name: /이 용어의 전체 페이지 읽기/ }).click()
  await expect(page).toHaveURL(/doc=grace/)
  await expect(page.locator('.reading-body h1')).toBeVisible()
  await expect(page.locator('.reading-body h1')).toHaveText(conceptTitle ?? '')
  await page.goBack()
  await expect(page).toHaveURL(/doc=acceptance.*state=criticism-grace/)
  await expect(page.locator('.reading-body')).toBeVisible()
})

test('concept preview supports modified clicks, retry, close during load, and stale response isolation', async ({ page, context }) => {
  await page.goto('?doc=acceptance&state=criticism-grace')
  const conceptLink = page.locator('.reading-body a[data-doc="concepts/grace"][aria-haspopup="dialog"]').first()
  await expect(conceptLink).toBeVisible()
  const [tab] = await Promise.all([context.waitForEvent('page'), conceptLink.click({ modifiers: ['Control'] })])
  await tab.waitForLoadState()
  await expect(tab.locator('.reading-body h1')).toBeVisible()
  await tab.close()

  let failureInjected = false
  await page.route('**/generated-content/*.json', async route => {
    const response = await route.fetch(), value = await response.json()
    if (!value.rows && value.type === 'Concept' && !failureInjected) {
      failureInjected = true
      await route.fulfill({ status: 503, body: 'unavailable' })
      return
    }
    await route.fulfill({ response })
  })
  await conceptLink.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('alert')).toBeVisible()
  await dialog.getByRole('button', { name: '설명 다시 불러오기' }).click()
  await expect(dialog.locator('.concept-preview-sources')).toBeVisible()

  await dialog.getByRole('button', { name: '말뜻 설명 닫기' }).click()
  await page.unrouteAll()
  await page.reload()
  let release!: () => void, entered!: () => void
  const waiting = new Promise<void>(resolve => { entered = resolve })
  const gate = new Promise<void>(resolve => { release = resolve })
  let delayedCloseUrl = ''
  await page.route('**/generated-content/*.json', async route => {
    const response = await route.fetch(), value = await response.json()
    if (!value.rows && value.type === 'Concept') { delayedCloseUrl = route.request().url(); entered(); await gate }
    await route.fulfill({ response })
  })
  await conceptLink.click()
  await waiting
  const delayedCloseResponse = page.waitForResponse(response => response.url() === delayedCloseUrl)
  await page.getByRole('button', { name: '말뜻 설명 닫기' }).click()
  release()
  await delayedCloseResponse
  await expect(page.getByRole('dialog')).toHaveCount(0)

  await page.unrouteAll()
  await page.reload()
  let releaseA!: () => void, enteredA!: () => void
  const waitA = new Promise<void>(resolve => { enteredA = resolve })
  const gateA = new Promise<void>(resolve => { releaseA = resolve })
  let delayedA = false
  let delayedAUrl = ''
  await page.route('**/generated-content/*.json', async route => {
    const response = await route.fetch(), value = await response.json()
    if (!value.rows && value.type === 'Concept' && !delayedA) { delayedA = true; delayedAUrl = route.request().url(); enteredA(); await gateA }
    await route.fulfill({ response })
  })
  await conceptLink.click()
  await waitA
  const delayedAResponse = page.waitForResponse(response => response.url() === delayedAUrl)
  await page.getByRole('button', { name: '말뜻 설명 닫기' }).click()
  const otherConcept = page.locator('.reading-body a[data-doc="concepts/resurrection"][aria-haspopup="dialog"]').first()
  await otherConcept.click()
  const activeDialog = page.getByRole('dialog')
  const activeTitle = await activeDialog.getByRole('heading', { level: 2 }).textContent()
  releaseA()
  await delayedAResponse
  await expect(activeDialog.locator('.concept-preview-sources')).toBeVisible()
  await expect(activeDialog.getByRole('heading', { level: 2 })).toHaveText(activeTitle!)
})
