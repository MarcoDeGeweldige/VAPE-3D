

import { GUI3DManager } from "@babylonjs/gui";
import { Interaction3Dpanel } from "./TestContext";


export class ExpressionUiManeger {

    openTab!: Interaction3Dpanel;
    manager: GUI3DManager;

    constructor(manager: GUI3DManager) {
        this.manager = manager;
    }

    Getmanager() {
        return this.manager;

    }

    GetScene() {
        return this.manager.scene;
    }

    OpenTab(cpanel: Interaction3Dpanel): void {


        if (this.openTab == null) {
            this.openTab = cpanel;
            this.openTab.setVisibility(true);
        }

        else {

            if (this.openTab == cpanel) {

                this.openTab?.setVisibility(!this.openTab.isVisible);

            }
            else {
                this.openTab?.setVisibility(false);
                this.openTab = cpanel;
                this.openTab.setVisibility(true);

            }

        }

    }

}