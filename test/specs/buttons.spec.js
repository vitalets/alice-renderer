
const {reply, buttons} = require('../../src');

describe('buttons', () => {
  it('by strings', () => {
    const res = reply`Как дела? ${buttons(['Отлично', 'Супер'])}`;
    assert.deepEqual(res.buttons, [
      {title: 'Отлично', hide: true},
      {title: 'Супер', hide: true},
    ]);
  });

  it('by objects', () => {
    const res = reply`
      Как дела? 
      ${buttons([
        {title: 'Отлично', url: 'https://ya.ru'}, 
        {title: 'Супер', payload: 42}
      ])}
    `;
    assert.deepEqual(res.buttons, [
      {title: 'Отлично', url: 'https://ya.ru', hide: true},
      {title: 'Супер', payload: 42, hide: true},
    ]);
  });

  it('defaults', () => {
    const res = reply`Как дела? ${buttons(['Отлично', 'Супер'], {hide: false})}`;
    assert.deepEqual(res.buttons, [
      {title: 'Отлично', hide: false},
      {title: 'Супер', hide: false},
    ]);
  });

  it('falsy', () => {
    const res = reply`Как дела? ${buttons(['Отлично', false, null, 0])}`;
    assert.deepEqual(res.buttons, [
      {title: 'Отлично', hide: true},
    ]);
  });
});
