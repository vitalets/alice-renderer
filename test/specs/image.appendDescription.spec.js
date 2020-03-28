const {reply, image} = require('../../src');

describe('image: appendDescription', () => {

  it('text < 128: write to title and show appendDescription', () => {
    const text = 'а'.repeat(128);
    const res = reply`
      ${text}
      ${image('1234567/xxx', { appendDescription: 'foo' })}
    `;
    assert.equal(res.text, text);
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: text,
      description: 'foo',
    });
  });

  it('text 128..256, append description', () => {
    const text = 'а'.repeat(200);
    const res = reply`
      ${text}
      ${image('1234567/xxx', { appendDescription: 'foo' })}
    `;
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: '',
      description: `${text} foo`,
    });
  });

  it('text > 256: write to title and description with appendDescription',  () => {
    const titleChunk = 'Ку-ку. Привет Привет Привет!';
    const descriptionChunk = 'А'.repeat(256 - titleChunk.length);
    const res = reply`
      ${titleChunk}
      ${descriptionChunk}
      ${image('1234567/xxx', { appendDescription: 'foo' })}
    `;
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: titleChunk,
      description: `${descriptionChunk} foo`,
    });
  });

  it('truncate appendDescription', () => {
    const appendDescription = 'а'.repeat(300);
    const res = reply`
      text
      ${image('1234567/xxx', { appendDescription })}
    `;
    assert.equal(res.text, 'text');
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: 'text',
      description: `${appendDescription.substr(0, 253)}...`,
    });
  });

});
