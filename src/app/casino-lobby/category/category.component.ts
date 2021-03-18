import { Component, Input, ChangeDetectionStrategy, Inject } from '@angular/core';
import { CasinoConfig, CASINO_CONFIG } from 'app/core/casino.config';

import { Layout } from '../layout/layout.graphql';

import { Category } from './category.graphql';

@Component({
  selector: 'xc-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent {
  @Input() category: Category;

  constructor(
    @Inject(CASINO_CONFIG) public casinoConfig: CasinoConfig,
  ) {
  }

  itemIdentity(index: number, _item: Layout) {
    return index;
  }

  /** Check if any of blocks inside the given layout will be displayed in 2+ row */
  public hasMultipleRows(node: Layout): boolean {
    return !!node.blocks.find((block) => block.row > 1 || block.sizeY > 1);
  }
}
