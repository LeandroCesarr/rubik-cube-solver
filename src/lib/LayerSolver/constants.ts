import { MOVEMENT } from "../enums/Movement";

export const POSITIONS_TO_FIRST_LAYER_CHECK = [6, 7, 8];

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

export const MAX_WHITE_CROSS_TRIES_COUNT = 5;
export const MAX_WHITE_FOREHEAD_TRIES_COUNT = 5;