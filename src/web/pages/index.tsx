import type { NextPage } from 'next';
import { FC, useState } from 'react';
import { Cube } from '../../lib/Cube';
import { MOVEMENT } from '../../lib/enums/Movement';
import { chunkArrayInGroups } from '../../helpers/chunkArrayInGroups';

interface IFaceProps {
  line: Array<number[]>;
}

const cube = new Cube();

const COLORS = [
  'bg-cyan-700',
  'bg-red-500',
  'bg-amber-300',
  'bg-orange-500',
  'bg-lime-700',
];

function getBackground(number: number): string {
  const index = Math.ceil(number / 9);

  return COLORS?.[index - 1] ?? '';
}

const Face: FC<IFaceProps> = ({ line }): JSX.Element => {
  return (
    <table className="w-full">
      <tbody>
        {line.map((line, idx) => (
          <tr key={`line-${idx}`}>
            <td className="flex border-collapse border-black">
              {line.map((position) => (
                <div
                  className={`w-full h-[60px] flex items-center justify-center border border-black ${getBackground(
                    position
                  )}`}
                  key={position}
                >
                  {position}
                </div>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Home: NextPage = () => {
  const [positions, setPositions] = useState(cube.positions);

  function handleMove(move: MOVEMENT): void {
    cube.move(move);

    setPositions([...cube.positions]);
  }

  return (
    <div className="flex items-center justify-center m-20">
      <table className="">
        <tbody>
          <tr>
            <td className="w-[180px]" />
            <td className="w-[180px]">
              <Face line={chunkArrayInGroups(positions[0], 3)} />
            </td>
            <td className="w-[180px]" />
          </tr>
          <tr>
            <td className="w-[180px] rotate-90">
              <Face line={chunkArrayInGroups(positions[1], 3)} />
            </td>
            <td className="w-[180px]">
              <Face line={chunkArrayInGroups(positions[2], 3)} />
            </td>
            <td className="w-[180px] -rotate-90">
              <Face line={chunkArrayInGroups(positions[3], 3)} />
            </td>
          </tr>
          <tr>
            <td className="w-[180px]" />
            <td className="w-[180px]">
              <Face line={chunkArrayInGroups(positions[4], 3)} />
            </td>
            <td className="w-[180px]" />
          </tr>
          <tr>
            <td className="w-[180px]" />
            <td className="w-[180px]">
              <Face line={chunkArrayInGroups(positions[5], 3)} />
            </td>
            <td className="w-[180px]" />
          </tr>
        </tbody>
      </table>
      <div className="flex flex-col ml-20">
        {Object.entries(MOVEMENT).map(([key, value]) => (
          <button
            className="button p-2 m-2 bg-red-400 rounded"
            key={value}
            onClick={() => handleMove(value)}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
