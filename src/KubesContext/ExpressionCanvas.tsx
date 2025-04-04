

import { useEffect, useRef } from "react";
import {
  Engine,
  Scene,
  FreeCamera,
  Vector3,
  HemisphericLight,
  Camera,
} from "@babylonjs/core";
import {
  GUI3DManager,
} from "@babylonjs/gui";

import { ExpressionUiManeger } from "./ExpressionUiManager";
import { UISingleton } from "./UIFunctions";
import { OperatorCube } from "./OperatorKube";

//maak dit een classe, waarbij method sce returned

function ExpressionBuilder() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;


    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    setupKubeScene();

    engine.runRenderLoop(() => scene.render());

    window.addEventListener("resize", () => engine.resize());


    return () => engine.dispose();

    function setupKubeScene() {
      const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

      const guiCamera = new FreeCamera("GUIC", new Vector3(0, 5, -10), scene);

      guiCamera.layerMask = 0x10000000;


      camera.setTarget(Vector3.Zero());
      camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
      var aspectRatio = engine.getAspectRatio(camera);
      var orthoSize = 6; // Adjust this value as needed

      camera.orthoLeft = -orthoSize * aspectRatio;
      camera.orthoRight = orthoSize * aspectRatio;
      camera.orthoTop = orthoSize;
      camera.orthoBottom = -orthoSize;
      camera.attachControl(canvasRef.current, true);

      scene.activeCameras = [camera, guiCamera];
      new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
      const CubeSize = { width: 2, height: 1.5, depth: 3 };
      const manager = new GUI3DManager(scene);
      manager.utilityLayer?.setRenderCamera(camera);

    
      const managerExp = new ExpressionUiManeger(manager);
      const rootCube = new OperatorCube(managerExp, new Vector3(0, 0, 0), "start");

      UISingleton.getInstance().printtree();
    }
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
}

export default ExpressionBuilder;
