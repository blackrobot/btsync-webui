# About

This is a custom interface for the Linux distribution of [BitTorrent
Sync](http://labs.bittorrent.com/experiments/sync.html).

**Ubuntu** users can install BitTorrent Sync from the `tuxpoldo/btsync` ppa.
Instructions on installing BitTorrent Sync for Ubuntu can be found in
[this post on the BitTorrent Sync forums](http://forum.bittorrent.com/topic/19560-debian-and-ubuntu-desktop-packages-for-bittorrent-sync/).

# Setup

*This assumes that your `storage_path` as defined in your `btsync.conf`
file, is set to the path `~/.btsync/`.*

1. Delete or backup the BitTorrent Sync `webui.zip` file:
```bash
$ cp ~/.btsync/webui.zip ~/.btsync/webui.zip.backup
```

2. Create a zip of everything in the `dist` directory of this project:
```bash
$ cd dist && zip -r ~/.btsync/webui.zip ./*
```

3. BitTorrent Sync will try to overwrite the new `webui.zip` on startup,
so to prevent that, we use `chattr`:
```bash
$ sudo chattr +ia ~/.btsync/webui.zip
```

4. Finally, restart BitTorrent Sync for the new changes to take effect:
```bash
$ pkill -u $(id -u) btsync && /path/to/btsync --config ~/btsync.conf
# Or if using the Ubuntu PPA:
$ /usr/bin/btsync-restart
```
