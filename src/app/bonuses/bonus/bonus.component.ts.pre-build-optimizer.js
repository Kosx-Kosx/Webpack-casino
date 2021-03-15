import { Bonus } from 'app/core/bonus.model';
import { HtmlContentComponent } from 'app/modal-shared/html-content/html-content.component';
import { ModalService } from 'app/modal/modal.service';
import { BonusesConfig } from '../bonuses.config';
var BonusComponent = /** @class */ (function () {
    function BonusComponent(config, modalService) {
        this.config = config;
        this.modalService = modalService;
        this.mode = 'available';
    }
    BonusComponent.prototype.createModal = function (title, content) {
        var _this = this;
        var componentRef = this.modalService.attachComponentModal(HtmlContentComponent);
        componentRef.instance.title = title;
        componentRef.instance.content = content;
        componentRef.instance.closed.subscribe(function () {
            _this.modalService.closeModal(componentRef);
        });
        return componentRef.instance.closed;
    };
    BonusComponent.prototype.openTerms = function (bonus) {
        this.createModal(bonus.name, bonus.terms_and_conditions);
    };
    Object.defineProperty(BonusComponent.prototype, "isDisabled", {
        get: function () {
            return this.mode === 'available' && !this.bonus.can_award;
        },
        enumerable: true,
        configurable: true
    });
    return BonusComponent;
}());
export { BonusComponent };
