const generateCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

console.log(generateCode());
module.exports = generateCode;
