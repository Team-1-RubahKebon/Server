module.exports = (date) => {
  return date.toISOString().substring(0, 10);
};
