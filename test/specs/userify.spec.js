
const Timeout = require('await-timeout');
const {reply, userify, audio, text, configure} = require('../../src');
const sessions = require('../../src/sessions');
const {hasUserId, getSessions} = sessions;

describe('userify', () => {

  const COUNT = 10;
  const USER_ID = 'user-1';
  const countResponses = (fn, callCount) => {
    return new Array(callCount).fill(true).reduce(acc => {
      const res = fn();
      const prop = res.text || res.tts;
      acc[prop] = (acc[prop] || 0) + 1;
      return acc;
    }, {});
  };

  beforeEach(() => {
    getSessions().clear();
  });

  describe('wrapped function', () => {

    it('array by ref', () => {
      const word = ['Отлично', 'Супер', 'Класс'];
      const fn = () => reply`${word}`;
      const wrappedFn = userify(USER_ID, fn);
      const counts = countResponses(wrappedFn, COUNT * word.length);

      assert.deepEqual(counts, {
        ['Отлично']: COUNT,
        ['Супер']: COUNT,
        ['Класс']: COUNT,
      });
    });

    it('array by value in reply', () => {
      const fn = () => reply`${['Отлично', 'Супер']}`;
      const wrappedFn = userify(USER_ID, fn);
      const counts = countResponses(wrappedFn, COUNT * 2);

      assert.deepEqual(counts, {
        ['Отлично']: COUNT,
        ['Супер']: COUNT,
      });
    });

    it('array by value in text', () => {
      const fn = () => reply`${text(['Отлично', 'Супер'])}`;
      const wrappedFn = userify(USER_ID, fn);
      const counts = countResponses(wrappedFn, COUNT * 2);

      assert.deepEqual(counts, {
        ['Отлично']: COUNT,
        ['Супер']: COUNT,
      });
    });

    it('array with objects', () => {
      const sound = [
        audio('one'),
        audio('two'),
        audio('three'),
      ];
      const fn = () => reply`${sound}`;
      const wrappedFn = userify(USER_ID, fn);
      const counts = countResponses(wrappedFn, COUNT * sound.length);

      assert.deepEqual(counts, {
        ['<speaker audio="alice-one.opus">']: COUNT,
        ['<speaker audio="alice-three.opus">']: COUNT,
        ['<speaker audio="alice-two.opus">']: COUNT,
      });
    });

    it('clear current user id even if error in fn', () => {
      const fn = () => {throw new Error('err');};
      const wrappedFn = userify(USER_ID, fn);
      assert.throws(() => wrappedFn(), /err/);
      assert.equal(hasUserId(), false);
    });

    it('fallback to random in case of errors', () => {
      sinon.stub(Math, 'random').returns(0.1);
      const arr = ['Отлично'];
      // simulate error as circular array
      arr.push({text: 'Супер', arr});
      const fn = () => reply`${arr}`;
      const wrappedFn = userify(USER_ID, fn);
      const res = wrappedFn();
      assert.equal(res.text, 'Отлично');
    });

    it('should work with single element', () => {
      const fn = () => reply`${['Отлично']}`;
      const wrappedFn = userify(USER_ID, fn);
      const counts = countResponses(wrappedFn, COUNT);
      assert.deepEqual(counts, {
        ['Отлично']: COUNT,
      });
    });

    it('avoid repeating value after array index reset', () => {
      const fn = () => reply`${['Отлично', 'Супер']}`;
      const wrappedFn = userify(USER_ID, fn);

      const res = [];
      const stub = sinon.stub(Math, 'random');
      stub.returns(0.1);
      res.push(wrappedFn());
      res.push(wrappedFn());
      stub.returns(0.9);
      res.push(wrappedFn());
      res.push(wrappedFn());

      assert.deepEqual(res.map(r => r.text), [
        'Отлично',
        'Супер',
        'Отлично',
        'Супер',
      ]);
    });

    it('proxy non-function value as is', () => {
      const value = 42;
      const wrapped = userify(USER_ID, value);
      assert.equal(wrapped, value);
    });

    describe('config.disableRandom = true', () => {
      before(() => {
        configure({disableRandom: true});
      });

      after(() => {
        configure({disableRandom: false});
      });

      it('always return first element if config.disableRandom = true', () => {
        const fn = () => reply`${['Отлично', 'Супер', 'Класс']}`;
        const wrappedFn = userify(USER_ID, fn);
        const counts = countResponses(wrappedFn, 30);

        assert.deepEqual(counts, {
          ['Отлично']: 30,
        });
      });
    });

  });

  describe('wrapped object', () => {

    it('call userified methods', () => {
      const word = ['Отлично', 'Супер', 'Класс'];
      const replies = {
        ok: () => reply`${word}`,
        bye: () => reply`${['Пока', 'До встречи']}`,
      };
      const wrapped = userify(USER_ID, replies);
      const countsOk = countResponses(wrapped.ok, COUNT * word.length);
      const countsBye = countResponses(wrapped.bye, COUNT * 2);

      assert.deepEqual(countsOk, {
        ['Отлично']: COUNT,
        ['Супер']: COUNT,
        ['Класс']: COUNT,
      });

      assert.deepEqual(countsBye, {
        ['Пока']: COUNT,
        ['До встречи']: COUNT,
      });
    });

    it('proxy non-function props as is', () => {
      const obj = {
        prop1: 42,
        prop2: {}
      };
      const wrapped = userify(USER_ID, obj);
      assert.equal(wrapped.prop1, obj.prop1);
      assert.equal(wrapped.prop2, obj.prop2);
    });

  });

  it('session cleanup', async () => {
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
