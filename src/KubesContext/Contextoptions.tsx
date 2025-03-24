
import { Color3, Mesh, MeshBuilder, Scene, TransformNode, Vector3 } from "@babylonjs/core";
import { Button3D, GUI3DManager, StackPanel3D, TextBlock } from "@babylonjs/gui";
import { DisplayPanel3D } from "./ContextPanel";
import { GradientMaterial } from "@babylonjs/materials";
import { Direction, DirectionVectors } from "./VectorDirections";



export const addNew3DPanell = (displayPanel: DisplayPanel3D, pos: Vector3, description: string, manager: GUI3DManager, scene: Scene) => {
  const newPanel = new StackPanel3D();
  newPanel.margin = 0.02;
  manager.addControl(newPanel);
  const transformNode = createLocalTransformNode();
  // Link the panel to the transform node
  newPanel.linkToTransformNode(transformNode);
  newPanel.addControl(createLocalButton3D(transformNode, description));
  return newPanel;

  function createLocalTransformNode(): TransformNode {
    const transformNode = new TransformNode("panelTransform", scene);
    transformNode.position = new Vector3(pos.x, pos.y, pos.z - 2);
    return transformNode;
  }

  function createLocalButton3D(transformNode : TransformNode, description : string) : Button3D{
    const button = new Button3D(); // Unique name for each button
    
    button.position = new Vector3(0, 1, 0); // Spread buttons out along the x-axis
    button.linkToTransformNode(transformNode);
    button.onPointerUpObservable.add(() => {
      displayPanel.onSelect();
  
    });
    button.content = SetTextBlock(description); // Assign text content to the button
    return button;
  }
};


export const SetTextBlock = (description: string): TextBlock => {
  const textBlock = new TextBlock();
  textBlock.text = description;
  textBlock.color = "white";
  textBlock.fontSize = 50;
  return textBlock;
};

//return pipes

export const CreatePipe = (start: Vector3, end: Vector3, dir: Direction = Direction.Down): Mesh => {
  const cylinder = MeshBuilder.CreateCylinder("cylinder", { diameterTop: 0 });
  cylinder.lookAt(DirectionVectors[dir]);
  cylinder.rotation.x = cylinder.rotation.x - (Math.PI / 2);
  cylinder.position = Vector3.Center(start, end);
  cylinder.material = createPipeMaterial();
  cylinder.isPickable = false;
  return cylinder;
};

const createPipeMaterial = function(): GradientMaterial{
  const newMaterial = new GradientMaterial("mymat");
  newMaterial.bottomColor = Color3.Green();
  newMaterial.topColor = Color3.Red();
  newMaterial.offset = 0.1;
  newMaterial.smoothness = 0.4;
  return newMaterial;


}

