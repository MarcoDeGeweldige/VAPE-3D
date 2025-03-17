

import { GUI3DManager, StackPanel3D } from "@babylonjs/gui"
import { Cube} from "./Kubes"
import { FollowCamera, Mesh, MeshBuilder, Scene, Vector3 } from "@babylonjs/core"



//remove file 
export const FocusCamera = function(pos: Vector3, manager : GUI3DManager){

    manager.scene._activeCamera?.position.set(pos.x, pos.y + 3, pos.z -10);

}

export const FocusOnPanel = function(pos : Vector3, scene : Scene){
    scene._activeCamera?.position.set(pos.x, pos.y + 3, pos.z -10);

    


}



export function getRandomnri(){

    return Math.random().toString();

    

}



export function getRandomnr() {
    return Math.random().toString();
}




