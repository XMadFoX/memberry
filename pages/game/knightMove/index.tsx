import React from 'react';
import GameBlock from '@components/gameBlock/gameBlock';
import KnightMove from './knightMove';

export default function Index() {
  return (
    <GameBlock id = "knight-move">
      <KnightMove />
    </GameBlock>
  );
}
