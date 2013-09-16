#!/bin/bash

BT_LIB="/usr/lib/btsync-user"
BT_DIR="${HOME}/.btsync"

SLEEP=2

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
  eval "${BT_LIB}/btsync-stopper"
  eval "${BT_LIB}/btsync-starter"
}

info "Restarting BitTorrent Sync..."
bt_restart &&
  info "Waiting ${SLEEP} seconds..." &&
  sleep $SLEEP &&
  warn "Backing up webui.zip to webui.backup.zip..." &&
  mv -f "${BT_DIR}/webui.zip" "${BT_DIR}/webui.backup.zip" &&
  info "Compiling new webui.zip and replacing original..."
  cd ../dist/ && zip -r "${BT_DIR}/webui.zip" ./* &&
  success "Finished!"
