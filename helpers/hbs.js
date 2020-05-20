const moment = require('moment');

module.exports = {
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      var new_str = str + ' ';
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(' '));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + '...';
    }
    return str;
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '');
  },
  formatDate: function (date, format) {
    return moment(date).format(format);
  },
  compare: function (v1, v2) {
    var str = 'selected';
    if (v1 === v2) {
      return str;
    }
  },
  editicon: function (storyUser, loggedUser, storyId) {
    if (storyUser == loggedUser) {
      return `<a href="/stories/edit/${storyId}"><i style="float: right;" class="fas fa-pencil-alt"></i></a>`;
    } else {
      return '';
    }
  },
};
