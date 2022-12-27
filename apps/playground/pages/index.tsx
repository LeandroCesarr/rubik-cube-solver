import type { NextPage } from 'next';
import {
  ButtonHTMLAttributes,
  FC,
  FormEvent,
  Fragment,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Cube } from '../../../packages/cube/src';
import { MOVEMENT } from '../../../packages/cube/src/modules/enums';
import { LayerSolver } from '../../../packages/layer-solver/src';

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
    <div className={`grid grid-cols-3 ${(FACES_TO_ROTATE as any)?.[faceIndex]}`}>
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

function useCube(): Cube {
  const cubeRef = useRef<Cube>();

  if (!cubeRef.current) {
    cubeRef.current = new Cube();
  }
  return cubeRef.current;
}

function useSolver(cube: Cube): LayerSolver {
  const solverRef = useRef<LayerSolver>();

  if (!solverRef.current) {
    solverRef.current = new LayerSolver(cube);
  }
  return solverRef.current;
}

const Home: NextPage = () => {
  const cube = useCube();
  const solver = useSolver(cube);
  const [moves, setMoves] = useState<string[]>([]);
  const [sequence, setSequence] = useState<string>('');
  const [counter, setCounter] = useState(-1);

  function onSubmit(evt: FormEvent): void {
    evt.preventDefault();

    const moves = sequence
      .replaceAll("'", '')
      .replace(/\s/g, '')
      .split(',')
      .map((item) => item.split("").join(" ")) as MOVEMENT[];

    cube.moveMany(moves);
    setMoves(moves);
  }

  function handleMove(move: MOVEMENT): void {
    cube.move(move);
    setMoves((old) => [...old, move]);
  }

  function handleReset(): void {
    cube.reset();

    setMoves([]);
  }

  function handleShuffle(): void {
    const moves = cube.shuffle();
    setMoves((old) => ([...old]));
  }

  async function handleSolve(): Promise<void> {
    const asolver = new LayerSolver(cube);
    const moves = await asolver.getSolve();

    // cube.moveMany(moves);

    setMoves((old) => [...old, ...moves]);
    setCounter(0);
  }

  useEffect(() => {
    if (counter != -1 && counter != moves.length) {
      console.log('caiu aqui');

      const id = setTimeout(() => {
        cube.move(moves[counter] as MOVEMENT)
        setCounter(old => old + 1)
      }, 300)

      return () => clearTimeout(id);
    }
  }, [counter]);

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
                <span>{value.split("").join(" ")}</span>
              </MoveButton>
            ))}
          </div>
        </div>
        <div className="">
          <h2>Input sequence</h2>
          <form onSubmit={onSubmit} className="flex flex-wrap gap-2 mt-2">
            <input
              type="text"
              className="text-black"
              onChange={(evt) => setSequence(evt.target.value)}
            />
            <ActionButton onClick={handleReset}>Submit</ActionButton>
          </form>
        </div>
        <div>
          <h2>Actions</h2>
          <div className="flex flex-wrap space-x-2 mt-2">
            <ActionButton onClick={handleReset}>Reset</ActionButton>
            <ActionButton onClick={handleShuffle}>Shuffle</ActionButton>
            <ActionButton onClick={handleSolve}>Solve</ActionButton>
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
              {cube.faces.map((face, faceIndex) => (
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
