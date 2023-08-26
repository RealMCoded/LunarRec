# Config Help

| Key Name                | Expected Value                        | Description                                                                                                                          | Default Value                          |
|-------------------------|---------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| `instance_info`         |                                       | Read the [Instance Info section](#instance-info) for details.                                                                                          |                                        |
| `logConnections`        | `bool`                                | Log incomming connections and what route they are going to                                                                           | `false`                                |
| `debugOutput`           | `bool`                                | Shows debug logs. Only for technical users.                                                                                          | `false`                                |
| `serverAddress`         | `string`                              | The IP of your server. Used for the name server and CDN.                                                                             | `"http://localhost:2017"`              |
| `targetVersion`         | `string` \|\| `null` \|\| `undefined` | The version your server is targeting.  Set it to `null` or `undefined` to target multiple.                                           | `null`                                 |
| `customPosters`         | `bool`                                | Allow custom posters to be used. Posters are pulled from `./cdn/posterImages/`                                                       | `false`                                |
| `allow2016AndEarly2017` | `bool`                                | Allow connections from 2016 early 2017 versions. **WARNING** Enabling this is a security risk due to all users using the same token. | `false`                                |
| `port`                  | `int`                                 | The port the server is hosted on.                                                                                                    | `2017`                                 |
| `token_signature`       | `string`                              | The signature used for your JSON Web Tokens.                                                                                         | LunarRec_ReplaceMeWithSomethingElsePlz |
| `webhook`               |                                       | Read the [Webhook section](#webhook) for details.                                                                                                |                                        |
| `discord_bot`           |                                       | Read the [Discord Bot section](#discord-bot) for details.                                                                                            |                                        |

## Instance Info

| Kay Name      | Expected Value | Description                                                             | Default Value           |
|---------------|----------------|-------------------------------------------------------------------------|-------------------------|
| `name`        | `string`       | The name of your instance. Can basically be whatever you want it to be. | `"LunarRec"`            |
| `description` | `string`       | A description of your instance.                                         | `"A LunarRec Instance"` |
| `owner`       | `string`       | A screen name, not your real name!                                      | `"Instance Owner"`      |
| `website`     | `string`       | A link to your website                                                  | `"https://example.com"` |

## Webhook

| Kay Name  | Expected Value | Description                                                             | Default Value |
|-----------|----------------|-------------------------------------------------------------------------|---------------|
| `console` | `string`       | A link to a Discord webhook for console output. Leave blank to disable. | `""`          |
| `reports` | `string`       | A link to a Discord webhook for Player reports. Leave blank to disable. | `""`          |

## Discord Bot

| Kay Name          | Expected Value | Description                                                                                                                             | Default Value                                |
|-------------------|----------------|-----------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|
| `enabled`         | `bool`         | A toggle to enable the Discord bot.                                                                                                     | `false`                                      |
| `token`           | `string`       | The token for your bot account.                                                                                                         | `"TOKEN.HERE"`                               |
| `clientID`        | `string`       | The ID of your bot account.                                                                                                             | `"1234567890"`                               |
| `serverID`        | `string`       | The ID of the server your bot will be in.                                                                                               | `"1234567890"`                               |
| `instanceOwnerID` | `string`       | Your Discord account ID.                                                                                                                | `"284804878604435476"`                       |
| `status`          | `object`       | The playing status of your bot. `"type"` is a string can be `"PLAYING"`, `"WATCHING"`, `"LISTENING"`, and `"COMPETING"`. `activity` is a string can be anything. | `{"type":"PLAYING", "activity": "LunarRec"}` |