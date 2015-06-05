BrowseSelect = (function(){
  var cssClass = function(string) {
    return string.replace(/[\s\W]/g, '-').toLowerCase();
  }

  var buildInterface = function(data){
    $base = $('<ul />').addClass('root');
    return buildNested($base, data);
  }

  var buildNested = function(el, data) {
    var $el = el, nested, current, $currentEl, $nestedEl;

    for (key in data) {
      current = data[key];
      nested = _.omit(current, 'id', 'name');

      if (current.hasOwnProperty('id')) {
        $currentEl = $('<li />').append(
          $('<a href="#" />').html(current.name)
        );
      } else {
        if (!_.contains(['id', 'name'], key)) {
          $currentEl = $('<li />').html(key);
        }
      }

      $el.append($currentEl);
      if (_.keys(nested).length > 0) {
        $nestedEl = $('<ul />').addClass('nested').addClass('nested___'+cssClass(key));
        buildNested($nestedEl, current);
        $currentEl.append($nestedEl);
      }
    }

    return $el;
  }

  function Module(input, options) {
    this.$input = $(input);
    this.options = options;
  }

  Module.prototype.build = function(){
    return buildInterface(this.options.data);
  }

  return Module;
})();
