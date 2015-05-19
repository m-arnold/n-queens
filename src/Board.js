// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var pieces = 0;
      _.each(this.get(rowIndex),function(item,i) {
        if (item === 1) {
          pieces++;
          if (pieces > 1) {
            return true;
          }
        }
      })
      return pieces > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var rows = this.get('n');
      for (var i = 0; i < rows; i++) {
        if(this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var pieces = 0;
      var rows = this.get('n');
      for (var i = 0; i < rows; i++) {
        var row = this.get(i)
        if (row[colIndex] === 1) {
          pieces++;
          if (pieces > 1) {
            return true;
          }
        }
      }
      return pieces > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var cols = this.get('n');
      for (var i = 0; i < cols; i++) {
        if(this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var pieces = 0;

      /*//col -1
      var countCheck = n - 1
      var 0 = (1,0)
      var 1 = (2,1)
      var y = x - 1

      //col -2
      var countCheck = n - 2
      var 0 = (2,0)
      var y = x - 2

      //col 0
      var countCheck = n
      var 0 = (0,0)
      var 1 = (1,1)
      var 2 = (2,2)
      var y = x

      //col 1
      var countCheck = n - 1
      var 0 = (0,1)
      var 1 = (1,2)
      var y = x + 1

      //col 2
      var countCheck = n - 2
      var 0 = (0,2)
      var y = x + 2

      //col n
      var countCheck = n - 2
      var 0 = (0,2)
      var y = x + 2*/

      var length = this.get('n') - Math.abs(majorDiagonalColumnIndexAtFirstRow);
      var yOffset = majorDiagonalColumnIndexAtFirstRow
      for (var i = 0; i < length; i++ ) {
        var x = majorDiagonalColumnIndexAtFirstRow >= 0 ? i : i - majorDiagonalColumnIndexAtFirstRow;
        var y = x + yOffset;
        var row = this.get(x);
        var value = row[y];
        if (value === 1) {
          pieces++;
          if (pieces > 1) {
            return true;
          }
        }
      }

      return pieces > 1;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var cols = this.get('n');
      var colStart =  - (cols - 1)

      for (var i = colStart; i < cols; i++) {
        if(this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var pieces = 0;

      var n = this.get('n')
      for (var x = 0; x < n; x++ ) {
        var y = -x + minorDiagonalColumnIndexAtFirstRow;
        if (this._isInBounds(x,y)) {
          var row = this.get(x);
          var value = row[y];
          if (value === 1) {
            pieces++;
            if (pieces > 1) {
              return true;
            }
          }
        }
      }

      // //col 3
      // var countCheck = n - 1
      // var 1 = (2,1)
      // var 2 = (1,2)
      // var y = -x + 3

      // //col 4
      // var countCheck = n - 2
      // var 2 = (2,2)
      // var y = -x + 4

      // //col 2
      // var countCheck = n
      // var 0 = (0,2)
      // var 1 = (1,1)
      // var 2 = (2,0)
      // var y = -x + 2

      // //col 1
      // var countCheck = n - 1
      // var 0 = (0,1)
      // var 1 = (1,0)
      // var y = -x + 1

      // //col 0
      // var countCheck = n - 2
      // var 0 = (0,0)
      // var y = -x

      // col n
      // var countCheck = n + 1
      // var y = -x + colIndex

      // var length = minorDiagonalColumnIndexAtFirstRow <= this.get('n') ? minorDiagonalColumnIndexAtFirstRow + 1 : this.get('n') - minorDiagonalColumnIndexAtFirstRow + 2;
      // var yOffset = minorDiagonalColumnIndexAtFirstRow
      // for (var i = 0; i < length; i++ ) {
      //   var x = minorDiagonalColumnIndexAtFirstRow < this.get('n') ? this.get('n') - minorDiagonalColumnIndexAtFirstRow - 1 + i : i + minorDiagonalColumnIndexAtFirstRow - this.get('n') + (this.get('n') - 1);
      //   var y = -x + yOffset;
      //   var row = this.get(x);
      //   var value = row[y];
      //   if (value === 1) {
      //     pieces++;
      //     if (pieces > 1) {
      //       return true;
      //     }
      //   }
      // }

      return pieces > 1;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var cols = this.get('n');
      var colEnd = cols + cols - 1;

      for (var i = 0; i < colEnd; i++) {
        if(this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
