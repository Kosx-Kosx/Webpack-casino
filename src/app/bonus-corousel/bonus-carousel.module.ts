import { NgModule } from '@angular/core';

import { ContentCarouselModule } from 'app/content-carousel/content-carousel.module';
import { SharedModule } from 'app/shared/shared.module';

import { BonusCarouselComponent } from './bonus-carousel.component';

@NgModule({
  imports: [
    SharedModule,
    ContentCarouselModule,
  ],
  exports: [
    BonusCarouselComponent,
  ],
  declarations: [
    BonusCarouselComponent,
  ],
})
export class BonusCarouselModule {
}
