BrowseSelect = (function(){
  var cssClass = function(string) {
    return string.replace(/[\s\W]/g, '-').toLowerCase();
  }

  var buildInterface = function(data){
    $base = $('<ul />')
      .addClass('hidden')
      .addClass('root');
    buildNested($base, data);

    return $('<div class="wrapper" />').append($base);
  }

  var buildNested = function(el, data) {
    var $el = el, nested, current, $currentEl, $nestedEl, $anchor

    for (key in data) {
      current = data[key];
      nested = _.omit(current, 'id', 'name');

      if (current.hasOwnProperty('id')) {
        $anchor = $('<a href="#" />')
            .addClass('add-option')
            .html(current.name);

        if (_.keys(nested).length > 0) {
          $anchor.addClass('toggle-nested');
        }

        $currentEl = $('<li />').append($anchor);
      } else {
        if (!_.contains(['id', 'name'], key)) {
          $currentEl = $('<li />').append(
            $('<a href="#" class="toggle-nested">').html(key)
          );
        }
      }

      $el.append($currentEl);
      if (_.keys(nested).length > 0) {
        $nestedEl = $('<ul />')
          .addClass('nested')
          .addClass('nested___'+cssClass(key))
          .addClass('hidden');

        buildNested($nestedEl, nested);
        $currentEl.append($nestedEl);
      }
    }

    return $el;
  }

  var buildFakeInput = function(input) {
    var $input = input;
    return $('<input />')
      .attr('type', 'text')
      .attr('name', $input.attr('name'))
      .addClass('form-control');
  }

  var replaceInput = function(input, data) {
    var $input = input, $interface, $fakeInput;
    $interface = buildInterface(data);
    $fakeInput = buildFakeInput(input);

    $input.attr('disabled', 'disabled');
    $input.after($interface);
    $interface.prepend($fakeInput);

    return $fakeInput;
  }

  var bindEvents = function(input) {
    var $input = input, $ul = $input.next('ul.root'), toggles;

    $input.on('focus', function(){
      $(this).next('ul.root').removeClass('hidden');
    });

    $(document).on('click', function(){
      if(!$(event.target).closest('div.wrapper').length) {
        $ul.addClass('hidden');
      }
    });

    toggles = $ul.find('.toggle-nested');
    _.each(toggles, function(toggle){
      $(toggle).on('click', function(){
        $(this).next('ul').toggleClass('hidden');
        return false;
      });
    });
  }

  function Module(input, options) {
    this.$input = $(input);
    this.options = options;
    var $fakeInput;

    $fakeInput = replaceInput(this.$input, options.data);
    bindEvents($fakeInput);
  }

  return Module;
})();
