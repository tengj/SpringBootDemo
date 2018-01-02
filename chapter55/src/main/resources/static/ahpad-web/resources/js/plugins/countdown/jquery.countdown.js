/*
 * jquery-countdown plugin
 *
 * Copyright (c) 2009 Martin Conte Mac Donell <Reflejo@gmail.com>
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 */

jQuery.fn.countdown = function(userOptions)
{
  // Default options
  var options = {
    stepTime: 60,
    // startTime and format MUST follow the same format.
    // also you cannot specify a format unordered (e.g. hh:ss:mm is wrong)
    format: "dddd:hh:mm:ss",
    startTime: "0001:12:32:55",
    digitImages: 6,
    digitWidth: 38,
    digitHeight: 63,
    timerEnd: function(){},
    image: "digits.png"
  };
  var digits = [], intervals = [];

  // Draw digits in given container
  var createDigits = function(where)
  {
    var c = 0;
    // Iterate each startTime digit, if it is not a digit
    // we'll asume that it's a separator
    for (var i = 0; i < options.startTime.length; i++)
    {
      if (parseInt(options.startTime[i]) >= 0)
      {
        elem = $('<div id="cnt_' + c + '" class="cntDigit" />').css({
          height: options.digitHeight,
          float: 'left',
          background: 'url(\'' + options.image + '\')',
          width: options.digitWidth
        });

        elem.current = parseInt(options.startTime[i]);
        digits.push(elem);

        margin(c, -elem.current * options.digitHeight * options.digitImages);

        // Add max digits, for example, first digit of minutes (mm) has
        // a max of 5. Conditional max is used when the left digit has reach
        // the max. For example second "hours" digit has a conditional max of 4
        switch (options.format[i]) 
        {
          case 'h':
            digits[c]._max = function(pos, isStart) {
              if (pos % 2 == 0)
                return 2;
              else
                return (isStart) ? 3: 9;
            };
            break;
          case 'd':
            digits[c]._max = function(){ return 9; };
            break;
          case 'm':
          case 's':
            digits[c]._max = function(pos){ return (pos % 2 == 0) ? 5: 9; };
        }
        ++c;
      }
      else
      {
        elem = $('<div class="cntSeparator"/>').css({float: 'left'})
                                               .text(options.startTime[i]);
      }

      where.append(elem)
    }
  };

  // Set or get element margin
  var margin = function(elem, val)
  {
    if (val !== undefined)
    {
      digits[elem].margin = val;
      return digits[elem].css({'backgroundPosition': '0 ' + val + 'px'});
    }

    return digits[elem].margin || 0;
  };

  var makeMovement = function(elem, steps, isForward)
  {
    // Stop any other movement over the same digit.
    if (intervals[elem])
      window.clearInterval(intervals[elem]);

    // Move to the initial position (We force that because in chrome
    // there are some scenarios where digits lost sync)
    var initialPos = -(options.digitHeight * options.digitImages *
                       digits[elem].current);
    margin(elem, initialPos);
    digits[elem].current = digits[elem].current + ((isForward) ? steps: -steps);

    var x = 0;
    intervals[elem] = setInterval(function(){
      if (x++ === options.digitImages * steps)
      {
        window.clearInterval(intervals[elem]);
        delete intervals[elem];
        return;
      }

      var diff = isForward ? -options.digitHeight: options.digitHeight;
      margin(elem, initialPos + (x * diff));
    }, options.stepTime / steps);
  };

  // Makes the movement. This is done by "digitImages" steps.
  var moveDigit = function(elem)
  {
    if (digits[elem].current == 0)
    {
      // Is there still time left?
      if (elem > 0)
      {
        var isStart = (digits[elem - 1].current == 0);

        makeMovement(elem, digits[elem]._max(elem, isStart), true);
        moveDigit(elem - 1);
      }
      else // That condition means that we reach the end! 00:00.
      {
        for (var i = 0; i < digits.length; i++)
        {
          clearInterval(intervals[i]);
          margin(i, 0);
        }
        options.timerEnd();
      }

      return;
    }

    makeMovement(elem, 1);
  };

  $.extend(options, userOptions);
  createDigits(this);
  intervals.main = setInterval(function(){ moveDigit(digits.length - 1); },
                               1000);
};
