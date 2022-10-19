import type { NextPage } from 'next';
import { ButtonHTMLAttributes, FC, Fragment, useEffect, useState } from 'react';
import { Cube } from '@/lib/Cube';
import { MOVEMENT } from '@/lib/enums/Movement';

const cube = new Cube();

const COLORS = [
  'bg-cyan-700',
  'bg-red-500',
  'bg-amber-300',
  'bg-orange-500',
  'bg-lime-700',
  'bg-white',
];

const FACES_TO_ROTATE = {
  0: 'rotate-180',
  1: 'rotate-90',
  3: '-rotate-90',
};

function getBackground(number: number): string {
  const index = Math.ceil(number / 9);
  return COLORS?.[index - 1] ?? '';
}

interface IActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const ActionButton: FC<IActionButtonProps> = ({
  children,
  ...props
}): JSX.Element => {
  return (
    <button {...props} className="bg-red_pink hover:bg-red_dark p-1 rounded">
      {children}
    </button>
  );
};

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const MoveButton: FC<IButtonProps> = ({ children, ...props }): JSX.Element => {
  return (
    <button
      {...props}
      className="bg-red_pink hover:bg-red_dark p-1 rounded w-[2em]"
    >
      {children}
    </button>
  );
};

const Face: FC<{ face: number[]; faceIndex: number }> = ({
  face,
  faceIndex,
}): JSX.Element => {
  return (
    <div className={`grid grid-cols-3 ${FACES_TO_ROTATE?.[faceIndex]}`}>
      {face.map((position, positionIndex) => (
        <Position key={positionIndex} position={position} />
      ))}
    </div>
  );
};

const Position: FC<{ position: number }> = ({ position }): JSX.Element => {
  return (
    <div
      className={` relative text-center  pt-[100%] ${getBackground(
        position
      )} transition-colors ease-out`}
    >
      <span className="absolute inset-0 flex items-center justify-center text-dark">
        {position.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

const INDEXES_TO_INJECT_EMPTY = [0, 4, 5];

const Home: NextPage = () => {
  const [positions, setPositions] = useState(cube.faces);
  const [moves, setMoves] = useState<string[]>([]);

  function handleMove(move: MOVEMENT): void {
    cube.move(move);
    setMoves((old) => [...old, move]);
    setPositions([...cube.faces]);
  }

  function handleReset(): void {
    cube.reset();

    setPositions([...cube.faces]);
    setMoves([]);
  }

  function handleShuffle(): void {
    const moves = cube.shuffle();

    setMoves(moves);
    setPositions([...cube.faces]);
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-5xl">Wall-C</h1>
      <p>Rubik`s cube solver</p>
      <div className="space-y-8 mt-10">
        <div className="">
          <h2>Moves</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(MOVEMENT).map(([key, value]) => (
              <MoveButton key={value} onClick={() => handleMove(value)}>
                <span>{value}</span>
              </MoveButton>
            ))}
          </div>
        </div>
        <div>
          <h2>Actions</h2>
          <div className="flex flex-wrap space-x-2 mt-2">
            <ActionButton onClick={handleReset}>Reset</ActionButton>
            <ActionButton onClick={handleShuffle}>Shuffle</ActionButton>
          </div>
        </div>
        <div>
          <h2>Current moves</h2>
          <p className="my-2 leading-none italic min-h-[1em]">
            {moves.join(', ')}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="holder w-[400px]">
            <div className="cube w-full grid grid-cols-3">
              {positions.map((face, faceIndex) => (
                <Fragment key={faceIndex}>
                  {INDEXES_TO_INJECT_EMPTY.includes(faceIndex) && <div />}
                  <Face face={face} faceIndex={faceIndex} />
                  {INDEXES_TO_INJECT_EMPTY.includes(faceIndex) && <div />}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
