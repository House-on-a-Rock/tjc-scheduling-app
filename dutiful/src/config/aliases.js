const aliases = (prefix = `src`) => ({
  '@components': `${prefix}/components`,
  '@features': `${prefix}/features`,
  '@hooks': `${prefix}/hooks/index`,
  '@assets': `${prefix}/assets`,
  '@providers': `${prefix}/providers`,
  '@routes': `${prefix}/routes`,
  '@lib': `${prefix}/lib`,
  '@themes': `${prefix}/themes`,
  '@constants': `${prefix}/constants`,
});

module.exports = aliases;
