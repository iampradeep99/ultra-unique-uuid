const { generate, generateV4, generateBatch, generateShort, UltraUniqueUUID } = require('./index');

describe('Ultra Unique UUID Generator', () => {
  test('should generate unique UUIDs', () => {
    const uuid1 = generate();
    const uuid2 = generate();
    
    expect(uuid1).not.toBe(uuid2);
    expect(uuid1).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/);
    expect(uuid2).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/);
  });

  test('should generate standard UUID v4', () => {
    const uuid = generateV4();
    expect(uuid).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
  });

  test('should generate batch of unique UUIDs', () => {
    const batch = generateBatch(10);
    expect(batch).toHaveLength(10);
    
    const uniqueSet = new Set(batch);
    expect(uniqueSet.size).toBe(10); // All should be unique
  });

  test('should generate short UUIDs', () => {
    const shortUuid = generateShort();
    expect(shortUuid).toMatch(/^[a-z0-9]+$/);
    expect(shortUuid.length).toBeGreaterThan(8);
  });

  test('should ensure uniqueness across large batches', () => {
    const largeBatch = generateBatch(1000);
    const uniqueSet = new Set(largeBatch);
    expect(uniqueSet.size).toBe(1000);
  });

  test('should work with class instance', () => {
    const generator = new UltraUniqueUUID();
    const uuid1 = generator.generate();
    const uuid2 = generator.generate();
    
    expect(uuid1).not.toBe(uuid2);
    expect(uuid1).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/);
  });

  test('should generate different UUIDs in rapid succession', () => {
    const uuids = [];
    for (let i = 0; i < 100; i++) {
      uuids.push(generate());
    }
    
    const uniqueSet = new Set(uuids);
    expect(uniqueSet.size).toBe(100);
  });

  test('should maintain uniqueness across multiple instances', () => {
    const gen1 = new UltraUniqueUUID();
    const gen2 = new UltraUniqueUUID();
    
    const batch1 = gen1.generateBatch(50);
    const batch2 = gen2.generateBatch(50);
    
    const combined = [...batch1, ...batch2];
    const uniqueSet = new Set(combined);
    expect(uniqueSet.size).toBe(100);
  });
});