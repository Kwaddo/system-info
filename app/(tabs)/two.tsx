import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Cell {
  value: number;
  revealed: boolean;
  flagged: boolean;
}

const Minesweeper = () => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const initializeBoard = () => {
    const newBoard: Cell[][] = Array(8)
      .fill(null)
      .map(() =>
        Array(8)
          .fill(null)
          .map(() => ({
            value: 0,
            revealed: false,
            flagged: false,
          }))
      );

    let minesPlaced = 0;
    while (minesPlaced < 10) {
      const x = Math.floor(Math.random() * 8);
      const y = Math.floor(Math.random() * 8);
      if (newBoard[x][y].value !== -1) {
        newBoard[x][y].value = -1;
        minesPlaced++;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (x + i >= 0 && x + i < 8 && y + j >= 0 && y + j < 8) {
              if (newBoard[x + i][y + j].value !== -1) {
                newBoard[x + i][y + j].value += 1;
              }
            }
          }
        }
      }
    }
    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
  };

  useEffect(() => {
    initializeBoard();
  }, []);

  const revealCell = (x: number, y: number) => {
    if (x < 0 || x >= 8 || y < 0 || y >= 8 || board[x][y].revealed || board[x][y].flagged) return;

    const newBoard = [...board];
    newBoard[x][y].revealed = true;
    setBoard(newBoard);

    if (board[x][y].value === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          revealCell(x + i, y + j);
        }
      }
    }
  };

  const handlePress = (x: number, y: number) => {
    if (gameOver || gameWon) return;

    if (board[x][y].flagged) return;

    if (board[x][y].value === -1) {
      const newBoard = [...board];
      newBoard.forEach((row) =>
        row.forEach((cell) => (cell.revealed = true))
      );
      setBoard(newBoard);
      setGameOver(true);
    } else {
      revealCell(x, y);
      const unrevealedSafeCells = board
        .flat()
        .filter((cell) => !cell.revealed && cell.value !== -1).length;
      if (unrevealedSafeCells === 0) {
        setGameWon(true);
      }
    }
  };

  const handleLongPress = (x: number, y: number) => {
    if (gameOver || gameWon || board[x][y].revealed) return;

    const newBoard = [...board];
    newBoard[x][y].flagged = !newBoard[x][y].flagged;
    setBoard(newBoard);
  };

  const getCellContent = (cell: Cell) => {
    if (cell.flagged) return '🚩';
    if (!cell.revealed) return '';
    if (cell.value === -1) return '💣';
    return cell.value || '';
  };

  return (
    <View style={styles.minesweeperContainer}>
      <View style={styles.board}>
        {board.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((cell, j) => (
              <TouchableOpacity
                key={`${i}-${j}`}
                style={[
                  styles.cell,
                  cell.revealed && styles.revealed,
                  gameOver && cell.value === -1 && styles.mine,
                ]}
                onPress={() => handlePress(i, j)}
                onLongPress={() => handleLongPress(i, j)}
              >
                <Text style={styles.cellText}>{getCellContent(cell)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      {(gameOver || gameWon) && (
        <View style={styles.popup}>
          <View style={styles.popupContent}>
            <Text style={styles.popupText}>
              {gameWon ? 'Congratulations!' : 'Game Over!'}
            </Text>
            <TouchableOpacity style={styles.resetButton} onPress={initializeBoard}>
              <Text style={styles.resetButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  minesweeperContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
    backgroundColor: '#121212',
  },
  board: {
    flexDirection: 'column',
    gap: 2,
    backgroundColor: '#29353C',
    padding: 10,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 2,
  },
  cell: {
    width: 28,
    height: 28,
    backgroundColor: '#4D6269',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  cellText: {
    fontSize: 16,
    color: 'white',
  },
  revealed: {
    backgroundColor: '#141B1F',
  },
  mine: {
    backgroundColor: '#ff4444',
  },
  popup: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContent: {
    backgroundColor: '#29353C',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  popupText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#1F2B30',
    padding: 10,
    borderRadius: 4,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Minesweeper;
