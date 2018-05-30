
import {FormControl} from '@angular/forms';

// 邮箱校验
export function emailValidator(control: FormControl): { [s: string]: boolean } {
  const EMAIL_REGEXP = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
  if (!control.value) {
    return { required: true };
  } else if (!EMAIL_REGEXP.test(control.value)) {
    return { error: true, email: true };
  }
}
