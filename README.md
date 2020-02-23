# Are your users passwords stroganoff?

Install the package:

```bash
yarn add stroganoff
```
Create your own password validator with custom options:

```javascript
import Stroganoff from 'stroganoff';

const options = {

}

const passwordValidator = new Stroganoff(options);

export default passwordValidator
```