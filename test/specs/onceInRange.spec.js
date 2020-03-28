
const {reply, onceInRange, userify, audio, configure} = require('../../src');
const {getSessions} = require('../../src/sessions');

describe('onceInRange', () => {
  const USER_ID = 'user-1';

  beforeEach(() => {
    getSessions().clear();
  });

  it('should output response between from...to calls', () => {
    const fn = () => reply`Привет! ${onceInRange(3, 5, 'Ку-ку')}`;
    const wrappedFn = userify(USER_ID, fn);
    const res = [];
    const stub = sinon.stub(Math, 'random');
    stub.returns(0.9);
    res.push(wrappedFn());
    stub.returns(0.1);
    res.push(wrappedFn());
    res.push(wrappedFn());
    res.push(wrappedFn());
    res.push(wrappedFn());
    res.push(wrappedFn());
    res.push(wrappedFn());
    res.push(wrappedFn());
    res.push(wrappedFn());

    assert.deepEqual(res.map(r => r.text), [
      'Привет!',
      'Привет!',
      'Привет!',
      'Привет!',
      'Привет! Ку-ку',
      'Привет!',
      'Привет!',
      'Привет! Ку-ку',
      'Привет!',
    ]);
  });

  it('response as reply', () => {
    const fn = () => reply`Привет! ${onceInRange(1, 1, reply`Ку-ку ${audio('one')}`)}`;
    const wrappedFn = userify(USER_ID, fn);
    const res = wrappedFn();
    assert.deepEqual(res, {
      text: 'Привет! Ку-ку',
      tts: 'Привет! Ку-ку <speaker audio="alice-one.opus">',
      end_session: false,
    });
  });

  it('fallback to random if not userified', () => {
    const fn = () => reply`Привет! ${onceInRange(1, 2, 'Ку-ку')}`;
    const stub = sinon.stub(Math, 'random');
    const res = [];
    stub.returns(0.9);
    res.push(fn());
    res.push(fn());
    stub.returns(0.1);
    res.push(fn());

    assert.deepEqual(res.map(r => r.text), [
      'Привет!',
      'Привет!',
      'Привет! Ку-ку',
    ]);
  });

  it('fallback to random in case of error', () => {
    // simulate error as circular obj to break JSON.stringify
    const obj = {};
    obj.text = 'Ку-ку';
    obj.ref = obj;
    const fn = () => reply`Привет! ${onceInRange(1, 2, obj)}`;
    const wrappedFn = userify(USER_ID, fn);
    const stub = sinon.stub(Math, 'random');
    const res = [];
    stub.returns(0.9);
    res.push(wrappedFn());
    res.push(wrappedFn());
    stub.returns(0.1);
    res.push(wrappedFn());

    assert.deepEqual(res.map(r => r.text), [
      'Привет!',
      'Привет!',
      'Привет! Ку-ку',
    ]);
  });

  describe('config.disableRandom = true', () => {
    before(() => {
      configure({disableRandom: true});
    });

    after(() => {
      configure({disableRandom: false});
    });

    it('should return response strictly once of N (not userified)', () => {
      const fn = () => reply`Привет! ${onceInRange(3, 5, 'Ку-ку')}`;
      const res = [...Array(9).keys()].map(() => fn().text);

      assert.deepEqual(res, [
        'Привет!',
        'Привет!',
        'Привет! Ку-ку',
        'Привет!',
        'Привет!',
        'Привет! Ку-ку',
        'Привет!',
        'Привет!',
        'Привет! Ку-ку',
      ]);
    });

    it('should return response strictly once of N (userified)', () => {
      const fn = () => reply`Привет! ${onceInRange(3, 5, 'Ку-ку')}`;
      const wrappedFn = userify(USER_ID, fn);
      const res = [...Array(9).keys()].map(() => wrappedFn().text);

      assert.deepEqual(res, [
        'Привет!',
        'Привет!',
        'Привет! Ку-ку',
        'Привет!',
        'Привет!',
        'Привет! Ку-ку',
        'Привет!',
        'Привет!',
        'Привет! Ку-ку',
      ]);
    });
  });

});
