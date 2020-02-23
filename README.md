# Are your users passwords stroganoff?

Install the package:

```bash
yarn add stroganoff
```
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
       * Default: 1
       * Optional
       */
      minLen: 6,

      /*
       * Maximum password length
       * Default: 6
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


### Options
| Option         | Default                       | Description                                                        | Optional |
|----------------|-------------------------------|--------------------------------------------------------------------|----------|
| numbers        | 1                             | Minimum amount of numbers the password should include              | true     |
| upper          | 1                             | Minimum amount of uppercase characters the password should include | true     |
| minLen         | 6                             | Minimum password length                                            | true     |
| maxLen         | 64                            | Maximum password length                                            | true     |
| special        | 1                             | Minimum amount of special characters the password should include   | true     |
| validMessage   | 'Your password is stroganoff' | The message to return for an invalid password                      | true     |
| invalidMessage | 'Beef stew'                   | The message to return for an invalid password                      | true     |
| specific       | true                          | Show the specific fields that are invalid                          | true     |