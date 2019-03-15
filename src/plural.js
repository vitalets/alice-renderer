/**
 * Plural RU forms.
 * Example:
 * plural(count, 'добавлен $1 бонус', 'добавлено $2 бонуса', 'добавлено $5 бонусов')
 *
 * See: https://github.com/vitalets/alice-renderer/issues/5
 * Inspired by: https://gist.github.com/tomfun/830fa6d8030d16007bbab50a5b21ef97
 */

const plural = (number, one, two, five) => {
  five = five || two;
  const n100 = Math.abs(number) % 100;
  const n10 = n100 % 10;
  const n1 = n10 % 1;
  const str = n1 !== 0 && !Number.isNaN(n1)
    ? two
    : between( 5, n100, 20)
      ? five
      : between( 2, n10, 4)
        ? two
        : (n10 === 1 ? one : five);
  return str.replace(/\$\d/g, number);
};

const between = (left, n, right) => n >= left && n <= right;

module.exports = {
  plural,
};
