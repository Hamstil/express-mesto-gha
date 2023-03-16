const regexUrl = /(http)?s?:\/\/(www\.)?[-a-zA-Z0-9:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+\-[\].$'*,;!~#?&//=]*)/;
const regexId = /^[0-9a-zA-Z]{24}$/;

module.exports = {
  regexUrl,
  regexId,
};
