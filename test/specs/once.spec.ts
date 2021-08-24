import {assert} from 'chai';
import * as sinon from 'sinon';
import {reply, once, userify} from '../../src';
import {getSessions} from '../../src';

afterEach(async () => {
  sinon.restore();
});
describe('once', () => {
  const USER_ID = 'user-1';

  beforeEach(() => {
    getSessions().clear();
  });

  it('throws if not userified', () => {
    // @ts-ignore
    const fn = () => reply`Привет! ${once({}, 'Ку-ку')}`;
    assert.throws(fn, /once\(\) is allowed only in userified mode/);
  });

  it('return response once for session if only leading provided', () => {
    const fn = () => reply`Привет! ${once({leading: true}, 'Ку-ку')}`;
    const wrappedFn = userify(USER_ID, fn);

    const res = [];
    res.push(wrappedFn());
    res.push(wrappedFn());
    res.push(wrappedFn());
    res.push(wrappedFn());

    assert.deepEqual(res.map(r => r.text), [
      'Привет! Ку-ку',
      'Привет!',
      'Привет!',
      'Привет!',
    ]);
  });

  it('return response once in N calls', () => {
    const fn = () => reply`Привет! ${once({calls: 3}, 'Ку-ку')}`;
    const wrappedFn = userify(USER_ID, fn);

    const res = [];
    res.push(wrappedFn());
    res.push(wrappedFn());
    res.push(wrappedFn());
    res.push(wrappedFn());
    res.push(wrappedFn());
    res.push(wrappedFn());

    assert.deepEqual(res.map(r => r.text), [
      'Привет!',
      'Привет!',
      'Привет! Ку-ку',
      'Привет!',
      'Привет!',
      'Привет! Ку-ку',
    ]);
  });

  it('return response once in N calls (leading: true)', () => {
    const fn = () => reply`Привет! ${once({calls: 3, leading: true}, 'Ку-ку')}`;
    const wrappedFn = userify(USER_ID, fn);

    const res = [];
    res.push(wrappedFn());
    res.push(wrappedFn());
    res.push(wrappedFn());
    res.push(wrappedFn());
    res.push(wrappedFn());
    res.push(wrappedFn());

    assert.deepEqual(res.map(r => r.text), [
      'Привет! Ку-ку',
      'Привет!',
      'Привет!',
      'Привет! Ку-ку',
      'Привет!',
      'Привет!',
    ]);
  });

  it('return response once in N seconds', () => {
    const fn = () => reply`Привет! ${once({seconds: 30}, 'Ку-ку')}`;
    const wrappedFn = userify(USER_ID, fn);

    const clock = sinon.useFakeTimers();

    const res = [];
    res.push(wrappedFn());

    clock.tick(10 * 1000);
    res.push(wrappedFn());

    clock.tick(10 * 1000);
    res.push(wrappedFn());

    clock.tick(10 * 1000);
    res.push(wrappedFn());

    clock.tick(30 * 1000);
    res.push(wrappedFn());
    res.push(wrappedFn());

    assert.deepEqual(res.map(r => r.text), [
      'Привет!',
      'Привет!',
      'Привет!',
      'Привет! Ку-ку',
      'Привет! Ку-ку',
      'Привет!',
    ]);
  });

  it('return response once in N seconds (leading=true)', () => {
    const fn = () => reply`Привет! ${once({seconds: 30, leading: true}, 'Ку-ку')}`;
    const wrappedFn = userify(USER_ID, fn);

    const clock = sinon.useFakeTimers();

    const res = [];
    res.push(wrappedFn());

    clock.tick(10 * 1000);
    res.push(wrappedFn());

    clock.tick(10 * 1000);
    res.push(wrappedFn());

    clock.tick(10 * 1000);
    res.push(wrappedFn());

    clock.tick(30 * 1000);
    res.push(wrappedFn());
    res.push(wrappedFn());

    assert.deepEqual(res.map(r => r.text), [
      'Привет! Ку-ку',
      'Привет!',
      'Привет!',
      'Привет! Ку-ку',
      'Привет! Ку-ку',
      'Привет!',
    ]);
  });

  it('use response as key', () => {
    // используем 2 once с разными ключами
    const fn = () => reply`
      Привет!
      ${once({leading: true}, 'Ку-ку')}
      ${once({leading: true, calls: 2}, 'Бе-бе')}
    `;
    const wrappedFn = userify(USER_ID, fn);

    const res = [];
    res.push(wrappedFn());
    res.push(wrappedFn());
    res.push(wrappedFn());

    assert.deepEqual(res.map(r => r.text), [
      'Привет! Ку-ку Бе-бе',
      'Привет!',
      'Привет! Бе-бе',
    ]);
  });

});
