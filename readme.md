# About

This is a custom interface for the Linux distribution of [BitTorrent
Sync](http://labs.bittorrent.com/experiments/sync.html).

**Ubuntu** users can install BitTorrent Sync from the `tuxpoldo/btsync` ppa.
Instructions on installing BitTorrent Sync for Ubuntu can be found in
[this post on the BitTorrent Sync forums](http://forum.bittorrent.com/topic/19560-debian-and-ubuntu-desktop-packages-for-bittorrent-sync/).

# Setup

*This assumes that your `storage_path` as defined in your `btsync.conf`
file, is set to the path `~/.btsync/`.*

To install, just run the `bin/install-ui.sh` script:
```bash
$ cd bin && ./install-ui.sh
```

Here's the process that script goes through, with the commands to use if
doing it manually:

1. Restart `btsync-desktop`. Replacing the `webui.zip` has to occur
before the first request is made to the web interface.
```bash
$ /usr/bin/btsync-restart
# Or, manually
$ pkill -u $(id -u) btsync && /path/to/btsync --config ~/btsync.conf
```

2. Delete or backup the BitTorrent Sync `webui.zip` file:
```bash
$ cp ~/.btsync/webui.zip ~/.btsync/webui.zip.backup
```

3. Create a zip of everything in the `dist` directory of this project:
```bash
$ cd dist && zip -r ~/.btsync/webui.zip ./*
```

4. The new web ui should be installed. Open a browser to check it out.

You will have to run this every time you update bt-sync. Optionally,
you can prevent the system from overwriting the `webui.zip` file after
installing it with something like this:
```bash
$ sudo chattr +ia ~/.btsync/webui.zip
```
