/**
 * Мок-данные для демонстрации визуальных компонентов.
 * Форма полностью совпадает с контрактами types/hn.ts — то, что должен
 * возвращать ваш api-слой. После подключения реальных данных файл можно удалить.
 *
 * Заголовки и категории — демонстрационные: реальный HN API отдаёт заголовки
 * как есть и не имеет категорий (поле category опционально).
 */

const minute = 60;
const hour = 60 * minute;
const day = 24 * hour;
const now = Math.floor(Date.now() / 1000);

export const mockStories = [
  {
    id: 42131001,
    title: 'SQLite as an application file format',
    url: 'https://www.sqlite.org/appfileformat.html',
    by: 'rberteig',
    time: now - 23 * minute,
    score: 89,
    descendants: 5,
    kids: [42131101, 42131102, 42131103],
    category: 'Databases',
  },
  {
    id: 42131005,
    title: 'Interview with the SQLite team: why embedded databases never went away',
    url: 'https://example.com/sqlite-interview',
    by: 'kevinmuir',
    time: now - 47 * minute,
    score: 156,
    descendants: 12,
    kids: [],
    category: 'Interview',
  },
  {
    id: 42131006,
    title: 'Chrome is disabling third-party cookies: what web developers should do',
    url: 'https://example.com/chrome-cookies',
    by: 'jgraham',
    time: now - 26 * minute,
    score: 47,
    descendants: 3,
    kids: [],
    category: 'Web',
  },
  {
    id: 42131002,
    title: 'Ask HN: What are you working on? (October 2026)',
    url: null,
    by: 'throwaway888',
    time: now - 5 * hour,
    score: 450,
    descendants: 1203,
    kids: [42131110],
    category: 'Discussion',
  },
  {
    id: 42131003,
    title: 'Show HN: I built a Zettelkasten out of plain text files',
    url: 'https://example.com/zettelkasten',
    by: 'ksteinfeld',
    time: now - 32,
    score: 12,
    descendants: 0,
    kids: [],
    category: 'Tools',
  },
  {
    id: 42131004,
    title: 'The LLVM compiler infrastructure project turns 23',
    url: 'https://llvm.org/',
    by: 'mehrdadn',
    time: now - 2 * day,
    score: 311,
    descendants: 87,
    kids: [42131120],
    category: 'Compilers',
  },
] satisfies import('../types/hn').Story[];

/** Все комментарии мока одним словарём: id → комментарий */
export const mockCommentsById: Record<number, import('../types/hn').Comment> = {
  42131101: {
    id: 42131101,
    by: 'pjc50',
    time: now - 18 * minute,
    text: '<p>Using SQLite as a file format is very attractive for tools that need random access to a complex data model. The whole ACID story means you never end up with a corrupted half-written file.</p><p>The main cost is that you give up human-readable diffs in version control — see <a href="https://sqlite.org/sqlar.html">SQLite Archive</a> for a middle ground.</p>',
    kids: [42131201],
  },
  42131201: {
    id: 42131201,
    by: 'ksec',
    time: now - 12 * minute,
    text: '<p>There is also the <code>.dump</code> command which exports a readable SQL script, which is what we use for reviewable diffs at work.</p>',
    kids: [42131301],
  },
  42131301: {
    id: 42131301,
    by: 'dragonwriter',
    time: now - 8 * minute,
    text: '<p>Yes, but note that it loses information about pages and indices, so the dump is not always a faithful round trip.</p>',
    kids: [],
  },
  42131102: {
    id: 42131102,
    by: '',
    time: now - 15 * minute,
    text: '',
    kids: [42131202],
    deleted: true,
  },
  42131202: {
    id: 42131202,
    by: 'spc476',
    time: now - 11 * minute,
    text: '<p>Replying to a deleted comment to keep the thread: the parent was about licensing concerns, which the SQLite <a href="https://www.sqlite.org/copyright.html">blessing</a> addresses.</p>',
    kids: [],
  },
  42131103: {
    id: 42131103,
    by: 'userbinator',
    time: now - 9 * minute,
    text: '<p>File format stability matters more than anything else here. Documents I created with SQLite 15 years ago still open without any migration step. Try that with a custom binary format.</p>',
    kids: [],
    dead: true,
  },
};

/** Корневые комментарии для первой новости мока */
export const mockRootComments = [
  mockCommentsById[42131101],
  mockCommentsById[42131102],
  mockCommentsById[42131103],
];
