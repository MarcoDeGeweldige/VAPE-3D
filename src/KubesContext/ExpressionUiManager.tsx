

import { GUI3DManager } from "@babylonjs/gui";
import { TestContext } from "./TestContext";


export class ExpressionUiManeger {

    openTab!: TestContext;
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

    OpenTab(cpanel: TestContext): void {


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