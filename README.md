
# Rick Roller

*Unlimited rolls and lulz*

![rick astley](https://i.imgur.com/NJgyIIQ.png)

credit to [ben monster](https://benmonster.com) on the drawing, check out his show tuesdays

### Requirements

1. twilio api [credentials](https://www.twilio.com/try-twilio) with voice enabled

### Installation

`npm i -g rick-roller`

### Usage

`rickroll`

Flags

- `--to` the number to call (required)
- `--from` your twilio voice number (required)
- `--greeting` say a greeting (optional)

Example

```bash
rickroll --to +15555555 --from +15555555 --greeting 'get rolled'
```
