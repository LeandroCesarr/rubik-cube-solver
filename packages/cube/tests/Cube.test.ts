import { describe, expect, it, vi } from 'vitest'
import { COLORS } from '../src/modules/constants'
import { Cube } from '../src/index'
import { MOVEMENT } from '../src/modules/enums'
import { defaultState } from './data/cube/defaultState'
import { movements } from './data/cube/movements'

const makeSTU = () => ({
  cube: new Cube()
})

describe('Cube', () => {
  it('should have initial state correctly', () => {
    // Arrange
    const { cube } = makeSTU();

    // Act

    // Assert
    expect(cube.faces).toStrictEqual(defaultState);
  })

  it('should reset correctly', () => {
    // Arrange
    const { cube } = makeSTU();

    // Act
    cube.shuffle();
    cube.reset();

    // Assert
    expect(cube.faces).toStrictEqual(defaultState);
  })

  it('should isSolved property must return true', () => {
    // Arrange
    const { cube } = makeSTU();

    // Act

    // Assert
    expect(cube.isSolved).toBeTruthy();
  })

  it('should isSolved property must return false', () => {
    // Arrange
    const { cube } = makeSTU();

    // Act
    cube.shuffle();

    // Assert
    expect(cube.isSolved).toBeFalsy();
  })

  it('should shuffle correctly', () => {
    // Arrange
    const shuffleCount = 2;
    const { cube } = makeSTU();

    vi.spyOn(cube, "move");
    vi.spyOn(cube, "shuffle");

    // Act
    const shuffleMovements = cube.shuffle(shuffleCount);

    // Assert
    expect(cube.shuffle).toHaveBeenCalledOnce();
    expect(cube.move).toHaveBeenCalledTimes(shuffleCount);

    shuffleMovements
      .reverse()
      .forEach((movement) => {
        if (movement[1] == "2") {
          cube.move(movement);
        } else {
          cube.move(
            (movement.length == 1 ? `${movement} *` : movement[0]) as MOVEMENT
          )
        }
      });

    cube.faces.forEach((face, idx) => {
      expect(face, `Face ${COLORS[idx]} - #${idx}`).toStrictEqual(defaultState[idx])
    });
  })
})

describe.each(Object.entries(movements))('Cube movements', (_, { moves, state }) => {
  it(`Face movement: ${moves.join(", ")}`, () => {
    // Arrange
    const { cube } = makeSTU();

    // Act
    moves.forEach((move) => cube.move(move));

    // Assert
    expect(cube.faces).toHaveLength(6)

    cube.faces.forEach((face, idx) => {
      expect(face).toHaveLength(9);
      expect(face, `Face ${COLORS[idx]} - #${idx}`).toStrictEqual(state[idx])
    })

    expect(
      cube.faces
        .flat()
        .some((position, index, positions) =>
          positions.indexOf(position) !== index
        )
    ).toBeFalsy();
  })
})
