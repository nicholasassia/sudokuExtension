function solvePuzzle() {
    // check if we're on a puzzle page (east/west.websudoku page)
    const puzzleGrid = document.querySelector('#puzzle_grid');
    if (!puzzleGrid) {
      // if not on west/east subdomain but on websudoku.com, try to find the puzzle URL
      if (window.location.hostname === 'www.websudoku.com') {
        const urlParams = new URLSearchParams(window.location.search);
        const level = urlParams.get('level') || '1';
        const setId = urlParams.get('set_id') || '';
        
        // try to redirect to the correct URL
        const eastUrl = `http://east.websudoku.com/?level=${level}${setId ? '&set_id=' + setId : ''}`;
        const westUrl = `http://west.websudoku.com/?level=${level}${setId ? '&set_id=' + setId : ''}`;
        
        alert(`No puzzle found. Try visiting:\n${eastUrl}\nor\n${westUrl}`);
        return;
      } else {
        alert('No puzzle found on this page.');
        return;
      }
    }
  
    // extract the current puzzle state
    function extractPuzzle() {
      const board = Array(9).fill().map(() => Array(9).fill(0));
      const cells = document.querySelectorAll('#puzzle_grid input');
      
      let index = 0;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          const cell = cells[index++];
          if (cell.hasAttribute('readonly')) {
            board[i][j] = parseInt(cell.value) || 0;
          } else {
            board[i][j] = 0;
          }
        }
      }
      return board;
    }
  
    // checks if value is valid in position
    function isPossible(board, row, col, val) {
      // check row
      for (let j = 0; j < 9; j++) {
        if (board[row][j] === val) return false;
      }
      
      // column
      for (let i = 0; i < 9; i++) {
        if (board[i][col] === val) return false;
      }
      
      // 3x3 box
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[startRow + i][startCol + j] === val) return false;
        }
      }
      return true;
    }
  
    // solve the puzzle
    function solve(board) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j] === 0) {
            for (let val = 1; val <= 9; val++) {
              if (isPossible(board, i, j, val)) {
                board[i][j] = val;
                if (solve(board)) {
                  return true;
                }
                board[i][j] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    }
  
    // fill in the solution on the page
    function fillSolution(board) {
      const cells = document.querySelectorAll('#puzzle_grid input');
      let index = 0;
      
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          const cell = cells[index++];
          if (!cell.hasAttribute('readonly')) {
            cell.value = board[i][j];
            const event = new Event('input', { bubbles: true });
            cell.dispatchEvent(event);
          }
        }
      }
    }
  
    // now we start the timer
    const startTime = performance.now();
    const board = extractPuzzle();
    
    if (solve(board)) {
      fillSolution(board);
      const endTime = performance.now();
      alert(`Puzzle solved in ${((endTime - startTime) / 1000).toFixed(5)} seconds!`);
    } else {
      alert("Couldn't solve the puzzle. It may be invalid.");
    }
}
