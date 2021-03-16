import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SecurityService {

  /**
   * During registration and payments, the API expects us to send a code
   * to help identify scammers etc. An example of such a service is Iovation.
   * "Finished" version is emitted if device detection was able to complete within 500ms.
   * Otherwise returns any available code or just an empty string.
   */
  securityCode$ = of('');
}
