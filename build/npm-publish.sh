#!/usr/bin/env bash
{ # 'try' block
    npm publish src/ax5core &&
    npm publish src/bootstrap-ax5mask &&
    npm publish src/bootstrap-ax5dialog &&
    npm publish src/bootstrap-ax5toast
} || { # 'catch' block
    echo "[ERROR] npm publish"
}