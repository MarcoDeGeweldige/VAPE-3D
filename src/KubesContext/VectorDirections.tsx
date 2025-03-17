import { Vector3 } from "@babylonjs/core";



enum Direction {
    Forward = "Forward",
    Backward = "Backward",
    Right = "Right",
    Left = "Left",
    Up = "Up",
    Down = "Down",
  }
  
  const DirectionVectors: Record<Direction, Vector3> = {
    [Direction.Forward]: new Vector3(0, 0, 1),
    [Direction.Backward]: new Vector3(0, 0, -1),
    [Direction.Right]: new Vector3(1, 0, 0),
    [Direction.Left]: new Vector3(-1, 0, 0),
    [Direction.Up]: new Vector3(0, 1, 0),
    [Direction.Down]: new Vector3(0, -1, 0),
  };
  
  export { Direction, DirectionVectors };




