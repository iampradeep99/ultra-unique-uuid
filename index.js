const crypto = require('crypto');
const os = require('os');
const cluster = require('cluster');

class UltraUniqueUUID {
  constructor() {
    this.counter = 0;
    this.machineId = this.generateMachineId();
    this.processId = process.pid;
    this.workerId = cluster.worker ? cluster.worker.id : 0;
  }

  generateMachineId() {
    const networkInterfaces = os.networkInterfaces();
    const mac = Object.values(networkInterfaces)
      .flat()
      .find(iface => iface && iface.mac && iface.mac !== '00:00:00:00:00:00')?.mac || 'unknown';
    
    return crypto.createHash('sha256')
      .update(mac + os.hostname() + os.arch() + os.platform())
      .digest('hex')
      .substring(0, 8);
  }

  generateTimestamp() {
    return Date.now().toString(36);
  }

  generateHighResTime() {
    const hrTime = process.hrtime.bigint();
    return hrTime.toString(36);
  }

  generateRandomSegment(length = 8) {
    return crypto.randomBytes(length).toString('hex');
  }

  generateNanoId() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars[crypto.randomInt(chars.length)];
    }
    return result;
  }

  generateCounter() {
    this.counter = (this.counter + 1) % 0xFFFFFF;
    return this.counter.toString(36).padStart(4, '0');
  }

  generate() {
    const timestamp = this.generateTimestamp();
    const highResTime = this.generateHighResTime();
    const randomSegment1 = this.generateRandomSegment(4);
    const randomSegment2 = this.generateRandomSegment(4);
    const nanoId = this.generateNanoId();
    const counter = this.generateCounter();
    
    // Combine all entropy sources
    const components = [
      timestamp,
      highResTime,
      this.machineId,
      this.processId.toString(36),
      this.workerId.toString(36),
      randomSegment1,
      randomSegment2,
      nanoId,
      counter
    ];

    // Create final hash for consistent length and format
    const combined = components.join('-');
    const hash = crypto.createHash('sha256').update(combined).digest('hex');
    
    // Format as UUID-like string with enhanced entropy
    return [
      hash.substring(0, 8),
      hash.substring(8, 12),
      hash.substring(12, 16),
      hash.substring(16, 20),
      hash.substring(20, 32)
    ].join('-');
  }

  generateV4() {
    // Standard UUID v4 with crypto random
    const bytes = crypto.randomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
    
    const hex = bytes.toString('hex');
    return [
      hex.substring(0, 8),
      hex.substring(8, 12),
      hex.substring(12, 16),
      hex.substring(16, 20),
      hex.substring(20, 32)
    ].join('-');
  }

  generateBatch(count = 1) {
    const batch = [];
    for (let i = 0; i < count; i++) {
      batch.push(this.generate());
    }
    return batch;
  }

  generateShort() {
    const components = [
      Date.now().toString(36),
      this.generateRandomSegment(2),
      this.generateCounter()
    ];
    return components.join('');
  }
}

// Create singleton instance
const uuidGenerator = new UltraUniqueUUID();

// Export functions
module.exports = {
  generate: () => uuidGenerator.generate(),
  generateV4: () => uuidGenerator.generateV4(),
  generateBatch: (count) => uuidGenerator.generateBatch(count),
  generateShort: () => uuidGenerator.generateShort(),
  UltraUniqueUUID
};

// For ES6 imports
module.exports.default = module.exports;