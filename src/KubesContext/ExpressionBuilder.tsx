

import { GUI3DManager, StackPanel3D } from "@babylonjs/gui"
import { FollowCamera, Mesh, MeshBuilder, Scene, Vector3 } from "@babylonjs/core"


export const FocusCamera = function(pos: Vector3, manager : GUI3DManager){

    manager.scene._activeCamera?.position.set(pos.x, pos.y + 3, pos.z -10);

}

export const FocusOnPanel = function(pos : Vector3, scene : Scene){
    scene._activeCamera?.position.set(pos.x, pos.y + 3, pos.z -10);
}

