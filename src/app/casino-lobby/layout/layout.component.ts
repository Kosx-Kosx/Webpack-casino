import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Block } from '../block/block.graphql';

import { Layout } from './layout.graphql';

@Component({
  selector: 'xc-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  @Input() layout: Layout;
  @Input() layoutIndex: number;

  itemIdentity(_index: number, item: Block) {
    let id = '';
    if (item.type === 'game') {
      id = `${item.game.vendor}:${item.game.slug}`;
    } else if (item.promotions) {
      // Check needed because it's possible that the block type is promo but it doesn't have a promotion object
      id = item.promotions[0].slug;
    }
    return `${item.col}:${item.row}:${item.sizeX}:${item.sizeY}:${id}`;
  }
}
