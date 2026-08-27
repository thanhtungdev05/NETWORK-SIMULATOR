'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const portal = fs.readFileSync(path.join(root, 'portal.html'), 'utf8');
const expected = {
  ac1000f: 'LAB_AC1000F_',
  ax3000c: 'LAB_AX3000CV2_',
  ax3000gz: 'LAB_AX3000GZ_',
  ax3000hv2: 'LAB_AX3000HV2_',
  ax3000s: 'LAB_AX3000S_',
  ac1000HI: 'LAB_AC1000HI_'
};
const hidden = ['be12000', 'be15000', 'vigor2927'];
const expectedTitles = [
  'Bài 1 - Cấu hình PPPoE',
  'Bài 2 - Cấu hình Wi-Fi',
  'Bài 3 - Cấu hình Wi-Fi IoT',
  'Bài 4 - Cấu hình DNS',
  'Bài 5 - Cấu hình DHCP',
  'Bài 6 - Cấu hình Port Forwarding'
];

for (const deviceId of hidden) {
  assert.equal(
    portal.includes(`devices/${deviceId}/`),
    false,
    `${deviceId} must remain hidden until its labs are approved`
  );
}
assert.doesNotMatch(portal, /\/lessons\/bai(?:[7-9]|10)\.js/);

const context = { console };
context.window = context;
vm.createContext(context);

const scripts = [...portal.matchAll(/<script\s+src="([^"]+\.js)(?:\?[^\"]*)?"/g)]
  .map((match) => match[1])
  .filter((relativePath) => relativePath.startsWith('devices/') || relativePath === 'data.js');
for (const relativePath of scripts) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  vm.runInContext(source, context, { filename: relativePath });
}

assert.deepEqual(
  Array.from(context.DEVICES, (device) => device.id),
  Object.keys(expected),
  'Portal device list must exactly match the approved device scope'
);

const migration = fs.readFileSync(
  path.join(root, 'api/migrations/030_enforce_approved_dashboard_catalog.sql'),
  'utf8'
);
for (const device of context.DEVICES) {
  const lessons = device.categories.flatMap((category) => category.lessons || []);
  assert.equal(lessons.length, 6, `${device.id} must expose exactly six labs`);
  assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, 6, `${device.id} lab IDs must be unique`);

  lessons.forEach((lesson, index) => {
    const expectedId = `${expected[device.id]}${String(index + 1).padStart(2, '0')}`;
    assert.equal(lesson.id, expectedId, `${device.id} lab ${index + 1} uses an unexpected ID`);
    assert.equal(lesson.title, expectedTitles[index], `${expectedId} has an inconsistent display title`);
    assert.ok(migration.includes(`'${expectedId}'`), `${expectedId} is missing from the active catalog migration`);

    const tooltipStore = context[`TOOLTIPS_${device.shortName.toUpperCase()}`] || {};
    const guide = tooltipStore[lesson.id]
      || (Array.isArray(lesson.guidePopups) && lesson.guidePopups.length > 0 ? lesson.guidePopups : null);
    assert.ok(Array.isArray(guide) && guide.length > 0, `${expectedId} must have a tooltip guide`);
  });
}

console.log('Portal/catalog audit passed: 6 devices, 36 unique labs, complete tooltip coverage.');
