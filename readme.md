# About

This is a custom interface for the Linux distribution of [BitTorrent
Sync](http://labs.bittorrent.com/experiments/sync.html).

# Screenshots

![Home Screen](https://i.imgur.com/JonBmtb.png)
![Open Dialog](https://i.imgur.com/8sAdW5g.png)

# Setup

**Ubuntu** users can install BitTorrent Sync from the `tuxpoldo/btsync` ppa.
Instructions on installing BitTorrent Sync for Ubuntu can be found in
[this post on the BitTorrent Sync forums](http://forum.bittorrent.com/topic/19560-debian-and-ubuntu-desktop-packages-for-bittorrent-sync/).

*This assumes that your `storage_path` as defined in your `btsync.conf`
file, is set to the path `~/.btsync/`.*

To install, just run the `install-ui` script:
```bash
$ ./install-ui
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

1. Delete or backup the BitTorrent Sync `webui.zip` file:

   ```bash
   $ cp ~/.btsync/webui.zip ~/.btsync/webui.zip.backup
   ```

1. Create a zip of everything in the `dist` directory of this project:

   ```bash
   $ cd dist && zip -r ~/.btsync/webui.zip ./*
   ```

1. The new web ui should be installed. Open a browser to check it out.

**Note:** You will have to run this every time you update BitTorrent Sync.
Optionally, you can prevent the system from overwriting the `webui.zip` file
after installing it with something like this:
```bash
$ sudo chattr +ia ~/.btsync/webui.zip
```
