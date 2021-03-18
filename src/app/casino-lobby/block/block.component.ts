import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
} from '@angular/core';
import { CasinoConfig, CASINO_CONFIG } from 'app/core/casino.config';

import { DetailsControllerService } from '../details-controller.service';
import { Layout } from '../layout/layout.graphql';

import { Block } from './block.graphql';

@Component({
  selector: 'xc-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockComponent {

  @Input() public layout: Layout;
  @Input() public block: Block;
  @Input() public layoutIndex: number;
  @Input() public blockIndex: number;

  constructor(
    @Inject(CASINO_CONFIG) public config: CasinoConfig,
    public detailsController: DetailsControllerService,
  ) {
  }

  get dimension() {
    return (this.block.sizeX === 1 ? 280 : 600) + 'x' + (this.block.sizeY === 1 ? 280 : 600) || '280x280';
  }

}
