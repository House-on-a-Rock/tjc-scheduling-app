const aliases = (prefix = `src`) => ({
  '@components': `${prefix}/components`,
  '@features': `${prefix}/features`,
  '@hooks': `${prefix}/hooks/index`,
  '@api': `${prefix}/apis`,
  '@assets': `${prefix}/assets`,
});

module.exports = aliases;
