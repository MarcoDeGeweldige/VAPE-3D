import { Engine, Scene } from "@babylonjs/core";
import { useEffect, useRef } from "react";
import { SetSelectedObject } from "../Helpers/AppManager";

type CanvasProps = {
  antialias: boolean,
  onSceneReady: any,
  id: string,
  setSelectedObject: SetSelectedObject,
}

export class SceneManager {
  engine: Engine;
  scenes = new Map<string, Scene>();
  activeScene = "";

  constructor(engine: Engine) {
    this.engine = engine;

    const self = this;

    engine.runRenderLoop(() => {
      let currentScene = self.CurrentScene();
      if(currentScene !== undefined) {
        currentScene.render();
      }
    });

    window.addEventListener("resize", () => {
      engine.resize();
    });
  }

  public CurrentScene() {
    return this.scenes.get(this.activeScene);
  }

  public SceneAddName(name: string) {
    let scene = new Scene(this.engine);
    this.scenes.set(name, scene);
  }

  public SceneAdd(name: string, scene: Scene) {
    this.scenes.set(name, scene);
  }

  public SceneSwitch(name: string) {
    this.activeScene = name;
    console.log(name);
  }
}

export default function CreateCanvas({ antialias, onSceneReady, id, setSelectedObject }: CanvasProps) {
  const rectCanvas = useRef(null);

  useEffect(() => {
    if (rectCanvas.current) {
      let sm = new SceneManager(new Engine(rectCanvas.current, antialias));
      let scene = new Scene(sm.engine);
      sm.SceneAdd("main", scene);
      sm.SceneSwitch("main");
      if (scene.isReady()) {
        onSceneReady(scene, setSelectedObject, sm);
      } else {
        scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
      }

      return () => {
        // scene.getEngine().dispose();

        // if (window) {
        //   window.removeEventListener("resize", resize);
        // }
      };
    }
  }, [rectCanvas]);
  return <canvas ref={rectCanvas} id={id} />;
};