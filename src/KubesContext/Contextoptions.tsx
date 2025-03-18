
import { Color3, Mesh, MeshBuilder, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import { Button3D, GUI3DManager, StackPanel3D, TextBlock } from "@babylonjs/gui";
import { DisplayPanel3D } from "./ContextPanel";
import { GradientMaterial } from "@babylonjs/materials";
import { Direction, DirectionVectors } from "./VectorDirections";



export const addNew3DPanell = (conPanel: DisplayPanel3D, pos: Vector3, description: string, manager: GUI3DManager, scene: Scene) => {
  const newPanel = new StackPanel3D();
  newPanel.margin = 0.02;
  manager.addControl(newPanel);

  
  // const button = new Button3D(); // Unique name for each button
  // button.position = new Vector3(0, 1, 0); // Spread buttons out along the x-axis
  const transformNode = createLocalTransformNode();

  // Link the panel to the transform node
  newPanel.linkToTransformNode(transformNode);

  // const button = new Button3D(); // Unique name for each button
  // button.position = new Vector3(0, 1, 0); // Spread buttons out along the x-axis
  // button.linkToTransformNode(transformNode);

  // button.onPointerUpObservable.add(() => {
  //   conPanel.onSelect();

  // });
  // button.content = GetText(description); // Assign text content to the button

  //newPanel.addControl(button);
  newPanel.addControl(createLocalButton3D(transformNode, description));
  return newPanel;


  function createLocalTransformNode() {
    const transformNode = new TransformNode("panelTransform", scene);
    transformNode.position = new Vector3(pos.x, pos.y, pos.z - 2);
    return transformNode;
  }

  function createLocalButton3D(transformNode : TransformNode, description : string) : Button3D{
    const button = new Button3D(); // Unique name for each button
    button.position = new Vector3(0, 1, 0); // Spread buttons out along the x-axis
    button.linkToTransformNode(transformNode);
    button.onPointerUpObservable.add(() => {
      conPanel.onSelect();
  
    });
    button.content = GetText(description); // Assign text content to the button


    return button;


  }
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

