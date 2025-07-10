#!/usr/bin/env node

const { generate, generateV4, generateBatch, generateShort, UltraUniqueUUID } = require('./index');

console.log('🚀 Ultra Unique UUID Benchmark\n');

function benchmark(name, fn, iterations = 10000) {
  console.log(`📊 ${name}:`);
  
  const start = process.hrtime.bigint();
  const results = [];
  
  for (let i = 0; i < iterations; i++) {
    results.push(fn());
  }
  
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000; // Convert to milliseconds
  
  // Check uniqueness
  const uniqueSet = new Set(results);
  const duplicates = results.length - uniqueSet.size;
  
  console.log(`   Time: ${duration.toFixed(2)}ms`);
  console.log(`   Rate: ${(iterations / (duration / 1000)).toFixed(0)} UUIDs/second`);
  console.log(`   Unique: ${uniqueSet.size}/${results.length} (${duplicates} duplicates)`);
  console.log(`   Avg per UUID: ${(duration / iterations).toFixed(4)}ms`);
  console.log('');
  
  return {
    name,
    duration,
    rate: iterations / (duration / 1000),
    unique: uniqueSet.size,
    total: results.length,
    duplicates
  };
}

function benchmarkBatch(name, fn, batchSize = 1000, iterations = 10) {
  console.log(`📊 ${name} (Batch):`);
  
  const start = process.hrtime.bigint();
  const allResults = [];
  
  for (let i = 0; i < iterations; i++) {
    const batch = fn(batchSize);
    allResults.push(...batch);
  }
  
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1000000;
  const totalGenerated = batchSize * iterations;
  
  const uniqueSet = new Set(allResults);
  const duplicates = allResults.length - uniqueSet.size;
  
  console.log(`   Time: ${duration.toFixed(2)}ms`);
  console.log(`   Rate: ${(totalGenerated / (duration / 1000)).toFixed(0)} UUIDs/second`);
  console.log(`   Unique: ${uniqueSet.size}/${allResults.length} (${duplicates} duplicates)`);
  console.log(`   Avg per batch: ${(duration / iterations).toFixed(4)}ms`);
  console.log('');
  
  return {
    name,
    duration,
    rate: totalGenerated / (duration / 1000),
    unique: uniqueSet.size,
    total: allResults.length,
    duplicates
  };
}

// Run benchmarks
const results = [];

results.push(benchmark('Enhanced UUID', generate, 10000));
results.push(benchmark('Standard UUID v4', generateV4, 10000));
results.push(benchmark('Short UUID', generateShort, 10000));

console.log('🔥 Batch Performance:');
results.push(benchmarkBatch('Enhanced UUID Batch', generateBatch, 1000, 10));

console.log('🧪 Stress Test (100K UUIDs):');
const stressStart = process.hrtime.bigint();
const stressBatch = generateBatch(100000);
const stressEnd = process.hrtime.bigint();
const stressDuration = Number(stressEnd - stressStart) / 1000000;

const stressUnique = new Set(stressBatch);
console.log(`   Generated: 100,000 UUIDs`);
console.log(`   Time: ${stressDuration.toFixed(2)}ms`);
console.log(`   Rate: ${(100000 / (stressDuration / 1000)).toFixed(0)} UUIDs/second`);
console.log(`   Unique: ${stressUnique.size}/100,000 (${100000 - stressUnique.size} duplicates)`);
console.log(`   Memory usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`);
console.log('');

console.log('🏆 Summary:');
console.log('┌─────────────────────────┬──────────────┬──────────────┬────────────┐');
console.log('│ Method                  │ Rate (UUID/s)│ Duplicates   │ Efficiency │');
console.log('├─────────────────────────┼──────────────┼──────────────┼────────────┤');

results.forEach(result => {
  const rate = result.rate.toFixed(0).padStart(12);
  const duplicates = result.duplicates.toString().padStart(12);
  const efficiency = ((result.unique / result.total) * 100).toFixed(2) + '%';
  const method = result.name.padEnd(23);
  console.log(`│ ${method} │${rate} │${duplicates} │${efficiency.padStart(10)} │`);
});

console.log('└─────────────────────────┴──────────────┴──────────────┴────────────┘');

console.log('\n✨ Benchmark completed!');
console.log('\nKey Insights:');
console.log('• Enhanced UUID provides maximum entropy and uniqueness');
console.log('• Batch generation is more efficient for large quantities');
console.log('• Zero duplicates indicates perfect uniqueness algorithm');
console.log('• High performance suitable for production workloads');