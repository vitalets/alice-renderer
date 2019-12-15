const {reply, image} = require('../../src');

describe('image', () => {
  it('text < 128: write to title', () => {
    const text = 'а'.repeat(128);
    const res = reply`
      ${text}
      ${image('1234567/xxx')}
    `;
    assert.equal(res.text, text);
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: text,
    });
  });

  it('text < 128, has original title: write to description', () => {
    const text = 'а'.repeat(128);
    const res = reply`
      ${text}
      ${image('1234567/xxx', {title: 'Привет'})}
    `;
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: 'Привет',
      description: text,
    });
  });

  it('text < 128, has original description: write to title', () => {
    const text = 'а'.repeat(128);
    const res = reply`
      ${text}
      ${image('1234567/xxx', {description: 'Привет'})}
    `;
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: text,
      description: 'Привет',
    });
  });

  it('text 128..256: write to description',  () => {
    const text = 'а'.repeat(256);
    const res = reply`
      ${text}
      ${image('1234567/xxx')}
    `;
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: '',
      description: text,
    });
  });

  it('text 128..256, has original title: write to description', () => {
    const text = 'а'.repeat(256);
    const res = reply`
      ${text}
      ${image('1234567/xxx', {title: 'Привет'})}
    `;
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: 'Привет',
      description: text,
    });
  });

  it('text 128..256, has original description: write to title', () => {
    const text = 'а'.repeat(256);
    const res = reply`
      ${text}
      ${image('1234567/xxx', {description: 'Привет'})}
    `;
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: `${text.substr(0, 125)}...`,
      description: 'Привет',
    });
  });

  it('text > 256: write to title and description',  () => {
    const titleChunk = 'Ку-ку. Привет!';
    const descriptionChunk = 'А'.repeat(300);
    const res = reply`
      ${titleChunk}
      ${descriptionChunk}
      ${image('1234567/xxx')}
    `;
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: titleChunk,
      description: `${descriptionChunk.substr(0, 253)}...`,
    });
  });

  it('text > 256, has original title: write to description',  () => {
    const titleChunk = 'Ку-ку. Привет!';
    const descriptionChunk = 'А'.repeat(300);
    const text = `${titleChunk} ${descriptionChunk}`;
    const res = reply`
      ${text}
      ${image('1234567/xxx', {title: 'Привет'})}
    `;
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: 'Привет',
      description: `${text.substr(0, 253)}...`,
    });
  });

  it('text > 256, has original description: write to title',  () => {
    const titleChunk = 'Ку-ку. Привет!';
    const descriptionChunk = 'А'.repeat(300);
    const text = `${titleChunk} ${descriptionChunk}`;
    const res = reply`
      ${text}
      ${image('1234567/xxx', {description: 'Привет'})}
    `;
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: `${text.substr(0, 125)}...`,
      description: 'Привет',
    });
  });

  it('dont change originally defined title and description', () => {
    const text = 'а'.repeat(128);
    const res = reply`
      ${text}
      ${image('1234567/xxx', {title: 'куку', description: 'Привет'})}
    `;
    assert.equal(res.text, text);
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: 'куку',
      description: 'Привет',
    });
  });

  it('nested reply: append to title', () => {
    const hi = reply`Привет!`;
    const res = reply`
      ${hi}
      Как дела?
      ${image('1234567/xxx')}
    `;
    assert.equal(res.text, 'Привет! Как дела?');
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: 'Привет! Как дела?',
    });
  });

  it('original title > 128', () => {
    const title = 'а'.repeat(200);
    const res = reply`
      Привет
      ${image('1234567/xxx', {title})}
    `;
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: `${title.substr(0, 125)}...`,
      description: 'Привет',
    });
  });

  it('original description > 256', () => {
    const description = 'а'.repeat(300);
    const res = reply`
      Привет
      ${image('1234567/xxx', {description})}
    `;
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: 'Привет',
      description: `${description.substr(0, 253)}...`,
    });
  });

  it('button', () => {
    const res = reply`
      Привет
      ${image('1234567/xxx', {
        button: {
          text: 'Кнопка'
        }
      })}
    `;
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: 'Привет',
      button: {
        text: 'Кнопка'
      }
    });
  });

  it('write to title and description if they defined as nulls', () => {
    const titleChunk = 'Ку-ку. Привет!';
    const descriptionChunk = 'А'.repeat(300);
    const text = `${titleChunk} ${descriptionChunk}`;
    const res = reply`
      ${text}
      ${image('1234567/xxx', {title: null, description: null})}
    `;
    assert.deepEqual(res.card, {
      type: 'BigImage',
      image_id: '1234567/xxx',
      title: `Ку-ку. Привет!`,
      description: `${descriptionChunk.substr(0, 253)}...`,
    });
  });
});
