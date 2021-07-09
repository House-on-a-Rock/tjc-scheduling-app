var secretIp = 'http://10.10.150.50:8081';

if (process.env.NODE_ENV === 'production') {
  secretIp = 'https://sheaves.herokuapp.com';
}

module.exports = {
  secretIp,
};
