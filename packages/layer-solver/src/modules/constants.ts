import { MOVEMENT } from "cube/src/modules/enums";

export const POSITIONS_TO_FIRST_LAYER_CHECK = [6, 7, 8];
export const POSITIONS_TO_SECOND_LAYER_CHECK = [3, 4, 5, 6, 7, 8];

export const  VERTICAL_FULL_ROTATIONS_MAP = {
  1: [MOVEMENT.LEFT_DOUBLE],
  3: [MOVEMENT.RIGHT_DOUBLE],
  4: [MOVEMENT.FRONT, MOVEMENT.FRONT],
  0: [MOVEMENT.BACK, MOVEMENT.BACK]
}

export const VERTICAL_ROTATIONS_MAP: Record<number, [MOVEMENT, MOVEMENT]> = {
  0: [MOVEMENT.BACK_REVERSE, MOVEMENT.BACK],
  1: [MOVEMENT.LEFT_REVERSE, MOVEMENT.LEFT],
  3: [MOVEMENT.RIGHT_REVERSE, MOVEMENT.RIGHT],
  4: [MOVEMENT.FRONT_REVERSE, MOVEMENT.FRONT],
}

export interface IFaceMovementMap {
  vertical: {
    left: {
      top: MOVEMENT;
      bottom: MOVEMENT;
    },
    right: {
      top: MOVEMENT;
      bottom: MOVEMENT;
    }
  },
  horizontal: {
    top: {
      left: MOVEMENT;
      right: MOVEMENT;
    },
    bottom: {
      left: MOVEMENT;
      right: MOVEMENT;
    }
  }
}

export const FACE_MOVEMENTS_MAP: Record<number, IFaceMovementMap> = {
  0: {
    vertical: {
      left: {
        top: MOVEMENT.RIGHT_REVERSE,
        bottom: MOVEMENT.RIGHT
      },
      right: {
        top: MOVEMENT.LEFT,
        bottom: MOVEMENT.LEFT_REVERSE
      }
    },
    horizontal: {
      top: {
        left: MOVEMENT.UP,
        right: MOVEMENT.UP_REVERSE
      },
      bottom: {
        left: MOVEMENT.DOWN_REVERSE,
        right: MOVEMENT.DOWN
      }
    }
  },
  1: {
    vertical: {
      left: {
        top: MOVEMENT.BACK_REVERSE,
        bottom: MOVEMENT.BACK
      },
      right: {
        top: MOVEMENT.FRONT,
        bottom: MOVEMENT.FRONT_REVERSE
      }
    },
    horizontal: {
      top: {
        left: MOVEMENT.UP,
        right: MOVEMENT.UP_REVERSE
      },
      bottom: {
        left: MOVEMENT.DOWN_REVERSE,
        right: MOVEMENT.DOWN
      }
    }
  },
  2: {
    vertical: {
      left: {
        top: MOVEMENT.LEFT_REVERSE,
        bottom: MOVEMENT.LEFT
      },
      right: {
        top: MOVEMENT.RIGHT,
        bottom: MOVEMENT.RIGHT_REVERSE
      }
    },
    horizontal: {
      top: {
        left: MOVEMENT.BACK,
        right: MOVEMENT.BACK_REVERSE
      },
      bottom: {
        left: MOVEMENT.FRONT_REVERSE,
        right: MOVEMENT.FRONT
      }
    }
  },
  3: {
    vertical: {
      left: {
        top: MOVEMENT.FRONT_REVERSE,
        bottom: MOVEMENT.FRONT
      },
      right: {
        top: MOVEMENT.BACK,
        bottom: MOVEMENT.BACK_REVERSE
      }
    },
    horizontal: {
      top: {
        left: MOVEMENT.UP,
        right: MOVEMENT.UP_REVERSE
      },
      bottom: {
        left: MOVEMENT.DOWN_REVERSE,
        right: MOVEMENT.DOWN
      }
    }
  },
  4: {
    vertical: {
      left: {
        top: MOVEMENT.LEFT_REVERSE,
        bottom: MOVEMENT.LEFT
      },
      right: {
        top: MOVEMENT.RIGHT,
        bottom: MOVEMENT.RIGHT_REVERSE
      }
    },
    horizontal: {
      top: {
        left: MOVEMENT.UP,
        right: MOVEMENT.UP_REVERSE
      },
      bottom: {
        left: MOVEMENT.DOWN_REVERSE,
        right: MOVEMENT.DOWN
      }
    }
  },
  5: {
    vertical: {
      left: {
        top: MOVEMENT.LEFT_REVERSE,
        bottom: MOVEMENT.LEFT
      },
      right: {
        top: MOVEMENT.RIGHT,
        bottom: MOVEMENT.RIGHT_REVERSE
      }
    },
    horizontal: {
      top: {
        left: MOVEMENT.FRONT,
        right: MOVEMENT.FRONT_REVERSE
      },
      bottom: {
        left: MOVEMENT.BACK_REVERSE,
        right: MOVEMENT.BACK
      }
    }
  }
}

/**
 * left position, right position, face to change
 */
export const YELLOW_CROSS_CASES = [
  [3, 1, 4],
  [1, 5, 1],
  [5, 7, 0],
  [7, 3, 3],
]

export const FOREHEADS_POSITIONS = [1, 3, 5, 7];

export const MAX_WHITE_CROSS_TRIES_COUNT = 5;
export const MAX_WHITE_FOREHEAD_TRIES_COUNT = 5;
export const MAX_WHITE_CORNER_TRIES_COUNT = 5;
export const MAX_WHITE_CORNERS_TRIES_COUNT = 5;
export const MAX_MIDDLE_FOREHEAD_TRIES_COUNT = 5;
export const MAX_YELLOW_CROSS_TRIES_COUNT = 5;

export const YELLOW_FACE_PATTERNS = {
  twoCorners: [
    {
      positions: [0, 2],
      face: 0
    },
    {
      positions: [0, 6],
      face: 1
    },
    {
      positions: [2, 8],
      face: 3
    },
    {
      positions: [6, 8],
      face: 4
    }
  ],
  fish: [
    {
      positions: [8, 6, 0],
      face: 0
    },
    {
      positions: [2, 8, 6],
      face: 1
    },
    {
      positions: [0, 2, 8],
      face: 4
    },
    {
      positions: [0, 2, 6],
      face: 3
    }
  ]
}