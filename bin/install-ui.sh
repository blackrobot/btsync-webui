#!/bin/bash

BT_LIB="/usr/lib/btsync-user"
BT_DIR="${HOME}/.btsync"

function success {
  echo ""
  echo -e "$(tput setaf 2)$(tput bold)${1}$(tput sgr0)"
  echo ""
}
function info {
  echo ""
  echo -e "$(tput setaf 7)$(tput bold)${1}$(tput sgr0)"
}
function warn {
  echo ""
  echo -e "$(tput setaf 3)$(tput bold)${1}$(tput sgr0)"
}

function bt_restart {
  local starter="${BT_LIB}/btsync-starter"
  local stopper="${BT_LIB}/btsync-stopper"

  info "Stopping BitTorrent Sync..."
  $stopper && warn "Waiting for BitTorrent Sync to fully shutdown..."

  while pgrep btsync -U $(id -u) > /dev/null; do
    printf " ."
    sleep 1;
  done

  echo ""
  info "Starting BitTorrent Sync..."
  $starter > /dev/null 2>&1 &&
    warn "Waiting for BitTorrent Sync to fully startup..."

  while true; do
    is_running=`pgrep -x btsync-agent -U $(id -u)`
    if [ "${is_running:-null}" = null ]; then
      printf " ."
      sleep 1;
    else
      # It's up and running
      break;
    fi
  done

  echo ""
  success "BitTorrent Sync started! :)"
}

bt_restart &&
  warn "Backing up webui.zip to webui.backup.zip..." &&
  mv -f "${BT_DIR}/webui.zip" "${BT_DIR}/webui.backup.zip" &&
  info "Compiling new webui.zip and replacing original..."
  cd ../dist/ && zip -r "${BT_DIR}/webui.zip" ./* >/dev/null &&
  success "Finished!"
