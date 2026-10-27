const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.argv[2] || 'playwright');
const root = path.resolve(__dirname, '../dist-web');
const result = { title: '测试画像', personality_depth: '测试分析', friend_profile: { nickname: '测试朋友', friend_analysis: '测试朋友分析' }, word_cloud: [{ word: '测试特质', desc: '测试特质解释', x: 500, y: 500, size: 50 }] };
let requests = [], fail = false;
const server = http.createServer((req, res) => {
  if (req.url === '/api/persona/calculate') {
    let body = ''; req.on('data', x => body += x); req.on('end', () => {
      requests.push(JSON.parse(body));
      res.writeHead(fail ? 503 : 200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(fail ? { error: 'unavailable' } : { code: 200, data: result }));
    }); return;
  }
  const file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); res.end(); return; }
  const target = file === root ? path.join(root, 'index.html') : file;
  const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html' };
  fs.readFile(target, (err, data) => { res.writeHead(err ? 404 : 200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream' }); res.end(err ? '' : data); });
});
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch({ headless: true, ...(process.argv[3] ? { executablePath: process.argv[3] } : {}) });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
    const url = `http://127.0.0.1:${server.address().port}`;
    await page.goto(url);
    await page.getByText('开始探索', { exact: true }).click();
    await page.locator('.quiz-option').first().click();
    await page.getByText('上一题', { exact: true }).click();
    await page.getByText('上次选择：A · 可重新选择', { exact: true }).waitFor();
    await page.locator('.quiz-option').nth(1).click();
    for (let i = 2; i <= 16; i++) { await page.getByText(`${i} / 16`, { exact: true }).waitFor(); await page.locator('.quiz-option').first().click(); }
    await page.getByText('测试画像', { exact: true }).waitFor();
    assert.equal(requests.length, 1); assert.equal(requests[0].answers['1'], 'B'); assert.equal(Object.keys(requests[0].answers).length, 16);
    await page.getByText('测试特质', { exact: true }).click(); await page.getByText('测试特质解释', { exact: true }).waitFor();
    await page.getByText('复制我的结果', { exact: true }).click();
    assert.match(await page.evaluate(() => navigator.clipboard.readText()), /测试画像/);
    await page.getByText('重新测试', { exact: true }).click(); await page.getByText('开始探索', { exact: true }).click();
    await page.getByText('1 / 16', { exact: true }).waitFor(); assert.equal(await page.getByText(/上次选择/).count(), 0);
    fail = true;
    for (let i = 1; i <= 16; i++) { await page.getByText(`${i} / 16`, { exact: true }).waitFor(); await page.locator('.quiz-option').first().click(); }
    await page.getByText('16 / 16', { exact: true }).waitFor(); fail = false;
    await page.locator('.quiz-option').first().click(); await page.getByText('测试画像', { exact: true }).waitFor();
    await page.reload(); await page.getByText('暂无结果，请先完成测试', { exact: true }).waitFor();
    await page.getByText('开始测试', { exact: true }).click(); await page.getByText('开始探索', { exact: true }).waitFor();
    assert.deepEqual(errors, []); console.log('PASS: previous answer replacement, complete payload, result, word detail, clipboard, retry reset, API failure/retry, empty result recovery');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });
