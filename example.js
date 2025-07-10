#!/usr/bin/env node

const { generate, generateV4, generateBatch, generateShort, UltraUniqueUUID } = require('./index');

console.log('🔑 Ultra Unique UUID Generator Examples\n');

console.log('1. Enhanced UUID (Maximum Entropy):');
for (let i = 0; i < 3; i++) {
  console.log(`   ${generate()}`);
}

console.log('\n2. Standard UUID v4:');
for (let i = 0; i < 3; i++) {
  console.log(`   ${generateV4()}`);
}

console.log('\n3. Short UUIDs:');
for (let i = 0; i < 3; i++) {
  console.log(`   ${generateShort()}`);
}

console.log('\n4. Batch Generation (5 UUIDs):');
const batch = generateBatch(5);
batch.forEach((uuid, index) => {
  console.log(`   ${index + 1}. ${uuid}`);
});

console.log('\n5. Using Class Instance:');
const generator = new UltraUniqueUUID();
for (let i = 0; i < 3; i++) {
  console.log(`   ${generator.generate()}`);
}

console.log('\n6. Uniqueness Test (1000 UUIDs):');
const testBatch = generateBatch(1000);
const uniqueSet = new Set(testBatch);
console.log(`   Generated: ${testBatch.length} UUIDs`);
console.log(`   Unique: ${uniqueSet.size} UUIDs`);
console.log(`   Duplicates: ${testBatch.length - uniqueSet.size}`);
console.log(`   ✅ ${uniqueSet.size === testBatch.length ? 'All unique!' : 'Duplicates found!'}`);

console.log('\n7. Rapid Generation Test:');
const start = process.hrtime.bigint();
const rapidBatch = generateBatch(10000);
const end = process.hrtime.bigint();
const duration = Number(end - start) / 1000000; // Convert to milliseconds

console.log(`   Generated 10,000 UUIDs in ${duration.toFixed(2)}ms`);
console.log(`   Rate: ${(10000 / (duration / 1000)).toFixed(0)} UUIDs/second`);
console.log(`   All unique: ${new Set(rapidBatch).size === rapidBatch.length ? 'Yes' : 'No'}`);

console.log('\n🎉 All tests completed!');
console.log('\nTry running:');
console.log('  npm test          - Run full test suite');
console.log('  npm run benchmark - Run performance benchmarks');
console.log('  node -e "console.log(require(\'./index\').generate())" - Generate single UUID');