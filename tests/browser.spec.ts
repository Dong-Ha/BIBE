import { expect, test } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

test('legacy passage links, Korean verse search, and invalid state recovery work at the deployment base', async ({ page }) => {
  await page.goto('?thread=cross&passage=jn-20-24')
  await expect(page.getByRole('heading', { level: 1, name: '나의 주, 나의 하나님' })).toBeVisible()
  await expect(page.getByRole('status')).toContainText('이전에 공유한 본문')
  const search = page.getByRole('searchbox')
  await search.fill('요한복음 20:24')
  await search.press('Enter')
  await expect(page).toHaveURL(/view=search/)
  await page.locator('.document-row').filter({ has: page.getByRole('heading', { name: '나의 주, 나의 하나님' }) }).click()
  await expect(page).toHaveURL(/doc=jn-20-24/)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: '나의 주, 나의 하나님' })).toBeVisible()
  await page.goto('?doc=story&state=not-a-scene')
  await expect(page.getByRole('status')).toContainText('처음 상태로 열었습니다')
  await expect(page.getByRole('heading', { name: '떠남', exact: true })).toBeVisible()
})

test('home opens fourteen question paths and a question reveals sources and deep reading', async ({ page }) => {
  await page.goto('./')
  await expect(page.locator('#questions .question-card')).toHaveCount(14)
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

test('all eleven experience pages cover the four learning modes in the direct exploration collection', async ({ page }) => {
  await page.goto('?view=experiences')
  await expect(page.getByRole('heading', { level: 1, name: '읽고, 움직이고, 발견하다' })).toBeVisible()
  await expect(page.locator('.question-card')).toHaveCount(11)
  for (const title of ['두 아들과 아버지의 이야기', '유월절과 예수의 십자가', '은혜와 변화의 관계', '실패와 비판, 용서를 바라보는 두 관점', '부활의 증언과 그 의미']) {
    await expect(page.getByRole('link', { name: new RegExp(title) })).toBeVisible()
  }
})

test('home, church hurt, and an interactive map fit the selected mobile or desktop viewport', async ({ page }) => {
  for (const path of ['./', '?doc=church-hurt', '?doc=connections', '?view=library', '?doc=study-galatians-freedom', '?doc=conscience-table']) {
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
  ] as const
  for (const [path, name] of routes) {
    await page.goto(path)
    await expect(page.locator('main')).toBeVisible()
    await page.screenshot({ path: `artifacts/${testInfo.project.name}-${name}.png`, fullPage: true })
  }
})


test('book reading paths link to passages, source scope and the installed Logos resource', async ({ page }) => {
  await page.goto('?view=library')
  await expect(page.locator('.question-card')).toHaveCount(6)
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
