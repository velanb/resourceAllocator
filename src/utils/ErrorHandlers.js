class ResourseAllocatorError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
}

class CostUtilsError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
}


module.exports = {
  ResourseAllocatorError,
  CostUtilsError
};