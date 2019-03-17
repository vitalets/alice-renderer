
const Timeout = require('await-timeout');
const {reply, userify, audio, text} = require('../../src');
const sessions = require('../../src/sessions');
const {hasUserId, getSessions} = sessions;

describe('userify', () => {

  const userId = 'user-1';
  const countResponses = (fn, callCount) => {
    return new Array(callCount).fill(true).reduce(acc => {
      const res = fn();
      const prop = res.text || res.tts;
      acc[prop] = acc[prop] ? acc[prop] + 1 : 1;
      return acc;
    }, {});
  };

  describe('wrapped function', () => {

    it('array by ref', () => {
      const word = ['Отлично', 'Супер', 'Класс'];
      const fn = () => reply`${word}`;
      const wrappedFn = () => userify(userId, fn)();
      const counts = countResponses(wrappedFn, 6);

      assert.deepEqual(counts, {
        ['Отлично']: 2,
        ['Супер']: 2,
        ['Класс']: 2,
      });
    });

    it('array by value in reply', () => {
      const fn = () => reply`${['Отлично', 'Супер']}`;
      const wrappedFn = () => userify(userId, fn)();
      const counts = countResponses(wrappedFn, 6);

      assert.deepEqual(counts, {
        ['Отлично']: 3,
        ['Супер']: 3,
      });
    });

    it('array by value in text', () => {
      const fn = () => reply`${text(['Отлично', 'Супер'])}`;
      const wrappedFn = () => userify(userId, fn)();
      const counts = countResponses(wrappedFn, 6);

      assert.deepEqual(counts, {
        ['Отлично']: 3,
        ['Супер']: 3,
      });
    });

    it('array with objects', () => {
      const sound = [
        audio('one'),
        audio('two'),
        audio('three'),
      ];
      const fn = () => reply`${sound}`;
      const wrappedFn = () => userify(userId, fn)();
      const counts = countResponses(wrappedFn, 6);

      assert.deepEqual(counts, {
        ['<speaker audio="alice-one.opus">']: 2,
        ['<speaker audio="alice-three.opus">']: 2,
        ['<speaker audio="alice-two.opus">']: 2,
      });
    });

    it('clear userId even if error in fn', () => {
      const fn = () => {throw new Error('err');};
      const wrappedFn = userify(userId, fn);
      assert.throws(() => wrappedFn(), /err/);
      assert.equal(hasUserId(), false);
    });

    it('fallback to random in case of errors', () => {
      const arr = ['Отлично'];
      arr.push(arr);
      const fn = () => reply`${arr}`;
      const wrappedFn = userify(userId, fn);
      const res = wrappedFn();
      assert.equal(typeof res.text, 'string');
    });
  });

  describe('wrapped object', () => {

    it('call userified methods', () => {
      const word = ['Отлично', 'Супер', 'Класс'];
      const replies = {
        ok: () => reply`${word}`,
        bye: () => reply`${['Пока', 'До встречи']}`,
      };
      const wrapped = userify(userId, replies);
      const countsOk = countResponses(wrapped.ok, 6);
      const countsBye = countResponses(wrapped.bye, 6);

      assert.deepEqual(countsOk, {
        ['Отлично']: 2,
        ['Супер']: 2,
        ['Класс']: 2,
      });

      assert.deepEqual(countsBye, {
        ['Пока']: 3,
        ['До встречи']: 3,
      });
    });

  });

  it('cleanup', async () => {
    sinon.stub(sessions, 'SESSION_TTL').get(() => 50);
    sinon.stub(sessions, 'CLEANUP_INTERVAL').get(() => 100);
    const fn = () => {};
    userify('user-1', fn);
    userify('user-2', fn);
    assert.equal(getSessions().size, 2);
    await Timeout.set(60);
    userify('user-3', fn);
    assert.equal(getSessions().size, 3);
    await Timeout.set(60);
    userify('user-3', fn);
    assert.equal(getSessions().size, 3, '3 sessions after TTL until cleanup');
    await Timeout.set(10);
    assert.equal(getSessions().size, 1, 'only user-3 session');
    assert.ok(getSessions().get('user-3'));
    await Timeout.set(110);
    userify('user-4', fn);
    await Timeout.set(10);
    assert.equal(getSessions().size, 1, 'only user-4 session');
    assert.ok(getSessions().get('user-4'));
  });

});
