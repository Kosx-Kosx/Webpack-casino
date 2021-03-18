import { CasinoConfig } from 'app/core/casino.config';
import { DetailsControllerService } from '../details-controller.service';
var BlockComponent = /** @class */ (function () {
    function BlockComponent(config, detailsController) {
        this.config = config;
        this.detailsController = detailsController;
    }
    Object.defineProperty(BlockComponent.prototype, "dimension", {
        get: function () {
            return (this.block.sizeX === 1 ? 280 : 600) + 'x' + (this.block.sizeY === 1 ? 280 : 600) || '280x280';
        },
        enumerable: true,
        configurable: true
    });
    return BlockComponent;
}());
export { BlockComponent };
