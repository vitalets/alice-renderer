const {reply, userify, select, audio, text, configure} = require('../../src');
const sessions = require('../../src/sessions');
const {hasUserId, getSessions, setValue, startCleanupService} = sessions;

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

    it('key depends on stringified array content', () => {
      const fn1 = () => reply`${['1', '2']}`;
      const fn2 = () => reply`${['3', '4']}`;
      const wrappedFn1 = userify(USER_ID, fn1);
      const wrappedFn2 = userify(USER_ID, fn2);
      const res1 = wrappedFn1();
      wrappedFn2();
      const res2 = wrappedFn1();
      // т.к. ключ для индекса генерится по контенту,
      // то промежуточный вызов wrappedFn2 не должен влиять на результаты wrappedFn1(),
      // они должны получиться разными между двумя вызовами.
      assert.notEqual(res1.text, res2.text);
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

    it('direct call of select', () => {
      const word = [reply`Отлично`, reply`Супер`, reply`Класс`];
      const fn = () => select(word);
      const wrappedFn = userify(USER_ID, fn);
      const counts = countResponses(wrappedFn, COUNT * word.length);

      assert.deepEqual(counts, {
        ['Отлично']: COUNT,
        ['Супер']: COUNT,
        ['Класс']: COUNT,
      });
    });

    it('select should return values without common words with prev value', () => {
      const values = [
        'привет как дела',
        'привет! как жизнь?',
        'добрый, день',
        'доброе утро',
      ];
      const fn = () => select(values);
      const wrappedFn = userify(USER_ID, fn);
      for (let i = 0; i <= 10; i++) {
        const calls = [
          wrappedFn(),
          wrappedFn(),
        ].map(w => w.substr(0, 4)).sort();
        assert.deepEqual(calls, [
          'добр',
          'прив',
        ]);
      }
    });

    it('calc key by strings as join of truncated strings', () => {
      const word = [
        'Отлично, Отлично, Отлично',
        'Супер, Супер, Супер',
        'Класс, Класс, Класс',
        'Здорово, Здорово, Здорово',
        'Прекрасно, Прекрасно, Прекрасно',
        'Шикарно, Шикарно, Шикарно',
      ];
      const fn = () => reply`${word}`;
      const wrappedFn = userify(USER_ID, fn);
      wrappedFn();
      const session = getSessions().get(USER_ID);
      assert.deepEqual(Object.keys(session), [
        '$timestamp',
        'Здорово, З|Класс, Кла|Отлично, О|Прекрасно,|Супер, Суп|Шикарно, Ш',
      ]);
    });

    it('dont cut emoji part in select keys', () => {
      const word = [ '🌟', '🎯' ]; // '\uD83C\uDF1F', '\uD83C\uDFAF'
      const fn = () => reply`${word}`;
      const wrappedFn = userify(USER_ID, fn);
      wrappedFn();
      const session = getSessions().get(USER_ID);
      assert.deepEqual(Object.keys(session), [
        '$timestamp',
        '🌟|🎯',
      ]);
    });

    describe('config.disableRandom = true', () => {
      before(() => {
        configure({disableRandom: true});
      });

      after(() => {
        configure({disableRandom: false});
      });

      it('always return first element', () => {
        const fn = () => reply`${['Отлично', 'Супер', 'Класс']}`;
        const wrappedFn = userify(USER_ID, fn);
        const counts = countResponses(wrappedFn, COUNT);

        assert.deepEqual(counts, {
          'Отлично': COUNT
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
    const MINUTE = 60 * 1000;
    const clock = sinon.useFakeTimers();
    startCleanupService();

    const actionByUser1 = userify('user-1', () => setValue('foo', 1));
    userify('user-2', () => setValue('foo', 2));
    assert.equal(getSessions().size, 2);

    clock.tick(4 * MINUTE);
    assert.equal(getSessions().size, 2);

    actionByUser1();
    clock.tick(MINUTE);
    assert.equal(getSessions().size, 1, 'user-2 cleaned as of no activity');
    assert.equal(getSessions().get('user-1').foo, 1);

    clock.tick(5 * MINUTE);
    assert.equal(getSessions().size, 0, 'user-1 cleaned as of no activity');
  });

});
