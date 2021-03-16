import { HttpParameterCodec } from '@angular/common/http';

// https://github.com/angular/angular/issues/11058
export class HttpUrlEncodingCodec implements HttpParameterCodec {
  encodeKey = encodeURIComponent;
  encodeValue = encodeURIComponent;
  decodeKey = decodeURIComponent;
  decodeValue = decodeURIComponent;
}
