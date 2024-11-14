# Notice

Work on LunarRec is mostly on a hiatus right now. 

I might fix some smaller bugs, but for the most part I might not do any big updates for a while.

---

<div align="center">
<img src="./readme/logo_text.png">
</div>

## About LunarRec

LunarRec is a server for Rec Room builds that multiple people can connect to. 

This project is similar to OpenRec Live or OpenLabs. If you're looking for a server that is more like OpenRec or Vault Server, check out [Rec.js](https://github.com/RealMCoded/Rec.js).

## Disclaimer

This project is not affiliated with [Rec Room](https://recroom.com/) in any way, nor intends to infringe on their copyrights. Distributing old versions of Rec Room is copyright infringement, so that's why LunarRec does not come bundled with Rec Room at all.

The LunarRec Project is not responsible for what happens with user hosted servers.

This project is also still in early development stages and is **not** production ready. Things don't work and may change in the future!

## Features

- Free & Open Source (under the [GNU Affero General Public License v3.0](./LICENSE) license).

- Fast & Efficient (depending on the hardware).

- Uses SQLite to store user data.

- Proper rate limiting 

- Uses [JSON Web Tokens](https://jwt.io/) for user authentication (can be disabled for older versions).

- Restrict connections to one version.

- Public API that shows Instance Name, Instance Description, Instance Host, Instance Owner, Target Version, ping, Registered Users, Online Users, Server Version.

- Hostable Discord bot to show server information and user stats!

## What does and doesn't work

### What works

- Polaroids

- Profile Images

- Name changing 

- Player searching

- Multi-Account support* (creation works, deletion doesn't)

- Bans* (must be done from admin console)

### What doesn't work (as of now)

- Proper sessions (private, proper room name and player limits)

- Custom Rooms

- Relationships

- Challenges

- Messages

- Parties

- Leaderboards

*\* work in progress feature, only somewhat works.* 

## Setup

*soon*

## Guidelines

If you host a server that is public, you need to follow some guidelines.

***NOTE:*** These guidelines will change in the future as the project grows. 

1. All servers must follow the Rec Room Code of Conduct!
2. Do not claim to be an official RecNet server. Don't include the word "RecNet" in your server at all.
3. This project is under the [GNU Affero General Public License v3.0](./LICENSE), which means you need to link back to the original source code if you make modifications (and choose to host it)