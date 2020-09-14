# Are your users' passwords stroganoff?
Don't let your users be Russian their passwords, make sure they're stroganoff.

- [x] Validate passwords server-side
- [x] Validate passwords client-side
- [x] Validate passwords as the user types
- [x] Validate passwords on submit  

![](https://i.imgur.com/fuMVrbq.gif)

Install the package:

```bash
yarn add stroganoff
```

### Setup
Create your own password validator with custom options:

```javascript
import Stroganoff, { StroganoffOptions } from 'stroganoff';

   const options: StroganoffOptions = {
      /*
       * Minimum amount of numbers the password should include
       * Default: 1
       * Optional
       */
      numbers: 1,

      /*
       * Minimum amount of uppercase characters the password should include
       * Default: 1
       * Optional
       */
      upper: 1,

      /*
       * Minimum amount of special characters the password should include
       * Default: 1
       * Optional
       */
      special: 1,

      /*
       * Minimum password length
       * Default: 12
       * Optional
       */
      minLen: 12,

      /*
       * Maximum password length
       * Default: 64
       * Optional
       */
      maxLen: 64,

      /*
       * Show the specific fields that are invalid
       * Default: true
       * Optional
       */
      specific: true,

      /*
       * The message to return for a valid password
       * Default: 'Your password is stroganoff'
       * Optional
       */
      validMessage: 'Your password is stroganoff',

      /*
       * The message to return for an invalid password
       * Default: 'Beef stew'
       * Optional
       */
      invalidMessage: 'Beef stew'
    }

const passwordValidator = new Stroganoff(options);

export default passwordValidator
```


### Validating passwords:
```javascript
const myPassword = '123abc';

/* 
{
  "valid": false,
  "message": "Beef Leek stew",
  "specific": {
    "numbers": true,
    "upper": false,
    "special": false,
    "minLen": false,
    "maxLen": true
  }
}
*/
const result = passwordValidator.validate(myPassword)

```


### Options
| Option         | Default                       | Description                                                        | Optional |
|----------------|-------------------------------|--------------------------------------------------------------------|----------|
| numbers        | 1                             | Minimum amount of numbers the password should include              | true     |
| upper          | 1                             | Minimum amount of uppercase characters the password should include | true     |
| minLen         | 12                            | Minimum password length                                            | true     |
| maxLen         | 64                            | Maximum password length                                            | true     |
| special        | 1                             | Minimum amount of special characters the password should include   | true     |
| validMessage   | 'Your password is stroganoff' | The message to return for a valid password                         | true     |
| invalidMessage | '~~Beef~~ Leek stew'          | The message to return for an invalid password                      | true     |
| specific       | true                          | Show the specific fields that are invalid                          | true     |
