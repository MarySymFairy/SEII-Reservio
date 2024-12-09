const test = require('ava');
const { getBusinessesByCategory } = require('../DefaultService');

test('getBusinessesByCategory returns businesses for a valid category', async t => {
  const categoryName = 'Breakfast';
  const businesses = await getBusinessesByCategory(categoryName);
  console.log('Businesses:', businesses); // Add logging
  t.is(businesses.length, 2);
  t.is(businesses[0]['businessCategory'], categoryName);
});

test('getBusinessesByCategory returns error for invalid category', async t => {
  const error = await t.throwsAsync(() => getBusinessesByCategory(''));
  console.log('Error:', error.message); // Add logging
  t.is(error.message, 'Invalid input parameters');
});