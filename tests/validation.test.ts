import { validatePrice, validateTradingPair, validateConfidence, validateTimestamp } from '../src/core/validation';

describe('Validation', () => {
  describe('validatePrice', () => {
    it('should validate valid price', () => {
      expect(() => validatePrice(100)).not.toThrow();
    });

    it('should throw for negative price', () => {
      expect(() => validatePrice(-100)).toThrow();
    });

    it('should throw for NaN', () => {
      expect(() => validatePrice(NaN)).toThrow();
    });
  });

  describe('validateTradingPair', () => {
    it('should validate supported trading pairs', () => {
      expect(() => validateTradingPair('SOL/USD')).not.toThrow();
    });

    it('should throw for unsupported trading pairs', () => {
      expect(() => validateTradingPair('INVALID/PAIR' as any)).toThrow();
    });
  });

  describe('validateConfidence', () => {
    it('should validate valid confidence scores', () => {
      expect(validateConfidence(0.95).isValid).toBe(true);
    });

    it('should reject confidence scores outside 0-1 range', () => {
      expect(validateConfidence(1.5).isValid).toBe(false);
      expect(validateConfidence(-0.5).isValid).toBe(false);
    });
  });

  describe('validateTimestamp', () => {
    it('should validate recent timestamps', () => {
      expect(validateTimestamp(Date.now()).isValid).toBe(true);
    });

    it('should reject future timestamps', () => {
      expect(validateTimestamp(Date.now() + 1000000).isValid).toBe(false);
    });
  });
});