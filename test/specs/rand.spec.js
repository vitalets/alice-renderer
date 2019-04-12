
const {reply, rand, userify, audio} = require('../../src');
const {getSessions} = require('../../src/sessions');

describe('rand', () => {
  const USER_ID = 'user-1';

  beforeEach(() => {
    getSessions().clear();
  });

  it('should output response between min/max calls', () => {
    const fn = () => reply`Привет! ${rand(3, 5, 'Ку-ку')}`;
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
    const fn = () => reply`Привет! ${rand(1, 1, reply`Ку-ку ${audio('one')}`)}`;
    const wrappedFn = userify(USER_ID, fn);
    const res = wrappedFn();
    assert.deepEqual(res, {
      text: 'Привет! Ку-ку',
      tts: 'Привет! Ку-ку <speaker audio="alice-one.opus">',
      end_session: false,
    });
  });

  it('fallback to random if not userified', () => {
    const fn = () => reply`Привет! ${rand(1, 2, 'Ку-ку')}`;
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
    const fn = () => reply`Привет! ${rand(1, 2, obj)}`;
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
});
