import { reverseEasing } from '../easing';

describe('easing', () => {
  describe('reverseEasing', () => {
    it('should return the easing parameter if it is falsy', () => {
      expect(reverseEasing(undefined)).toEqual(undefined);
      expect(reverseEasing(null)).toEqual(null);
    });

    it('should not change direction of non-directional easings', () => {
      expect(reverseEasing("linear")).toEqual("linear");
      expect(reverseEasing("easeInOutBack")).toEqual("easeInOutBack");
    });

    it('should change easeIn to easeOut and vice versa', () => {
      expect(reverseEasing("easeInBack")).toEqual("easeOutBack");
      expect(reverseEasing("easeOutBack")).toEqual("easeInBack");
    });
  });
});