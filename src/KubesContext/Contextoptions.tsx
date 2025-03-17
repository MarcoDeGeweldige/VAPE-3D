
import { Color3, Mesh, MeshBuilder, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import { Button3D, GUI3DManager, StackPanel3D, TextBlock } from "@babylonjs/gui";
import { ContextPanel } from "./ContextPanel";
import { GradientMaterial } from "@babylonjs/materials";
import { Direction, DirectionVectors } from "./VectorDirections";



export const addPanell = (conPanel: ContextPanel, pos: Vector3, txt: string, manager: GUI3DManager, scene: Scene) => {
  const aPanel = new StackPanel3D();
  aPanel.margin = 0.02;
  manager.addControl(aPanel);
  const transformNode = new TransformNode("panelTransform", scene);
  transformNode.position = new Vector3(pos.x, pos.y, pos.z - 2);

  // Link the panel to the transform node
  aPanel.linkToTransformNode(transformNode);

  const button = new Button3D("nikk"); // Unique name for each button
  button.position = new Vector3(0, 1, 0); // Spread buttons out along the x-axis
  button.linkToTransformNode(transformNode);
  button.onPointerUpObservable.add(() => {
    // Call the `conext menu event` method
    conPanel.onSelect();

  });

  button.content = GetText(txt); // Assign text content to the button

  aPanel.addControl(button);
  return aPanel;

};



export const GetText = (txt: string): TextBlock => {
  const text = new TextBlock();
  text.text = txt;
  text.color = "white";
  text.fontSize = 50;
  return text;
};

//return pipes

export const ConnectPipec = (start: Vector3, end: Vector3, schaal: Vector3, dir: Direction = Direction.Down): Mesh => {

  // Compute the midpoint for positioning
  const midpoint = Vector3.Center(start, end);

  const nmat = new GradientMaterial("mymat");

  nmat.bottomColor = Color3.Green();
  nmat.topColor = Color3.Red();
  nmat.offset = 0.1;

  nmat.smoothness = 0.4;

  const cylinder = MeshBuilder.CreateCylinder("cylinder", { diameterTop: 0 });
  cylinder.lookAt(DirectionVectors[dir]);

  cylinder.rotation.x = cylinder.rotation.x - (Math.PI / 2);
  cylinder.position = midpoint;

  cylinder.material = nmat;
  cylinder.isPickable = false;

  return cylinder;

};

